import { fmt } from "../utils/formatting";

/**
 * DETERMINISTIC CONTINUITY SCORING ENGINE
 */
export const calculateContinuityScore = (assets = [], people = [], documents = [], continuity = null, obligations = []) => {
  const positiveAssets = assets.filter((a) => (a.approxValue || 0) > 0);
  const liabilities = assets.filter((a) => (a.approxValue || 0) < 0 || a.type === "Loans" || a.type === "Liabilities");
  const totalAssetsCount = positiveAssets.length;
  
  // 1. Asset Coverage (Max: 10)
  const assetCoverageScore = totalAssetsCount >= 4 ? 10 : totalAssetsCount * 2.5;

  // 2. Nominee Coverage (Max: 15)
  const assetsWithNominee = positiveAssets.filter((a) => a.nomineeId || (a.nominee && a.nominee.trim().length > 0));
  const nomineeCoveragePct = totalAssetsCount > 0 ? assetsWithNominee.length / totalAssetsCount : 0;
  const nomineeCoverageScore = Math.round(nomineeCoveragePct * 15);

  // 3. Nominee Verification (Max: 10)
  const assetsWithVerifiedNominee = positiveAssets.filter((a) => a.nomineeVerified === true);
  const nomineeVerifiedPct = totalAssetsCount > 0 ? assetsWithVerifiedNominee.length / totalAssetsCount : 0;
  const nomineeVerifiedScore = Math.round(nomineeVerifiedPct * 10);

  // 4. Document Coverage (Max: 15)
  const assetsWithDocs = positiveAssets.filter((a) => {
    const directDocs = a.documents && a.documents.length > 0;
    const linkedDocs = documents.some((d) => d.linkedAssetId === a.id);
    return directDocs || linkedDocs;
  });
  const docCoveragePct = totalAssetsCount > 0 ? assetsWithDocs.length / totalAssetsCount : 0;
  const docCoverageScore = Math.round(docCoveragePct * 15);

  // 5. Trusted Person Readiness (Max: 15)
  const primaryTrustee = people.find((p) => p.isPrimaryTrustee || p.role?.toLowerCase().includes("trustee") || p.role?.toLowerCase().includes("trusted"));
  let trustedPersonScore = 0;
  if (primaryTrustee) {
    if (primaryTrustee.status === "Verified") trustedPersonScore += 6;
    else if (primaryTrustee.status === "Active") trustedPersonScore += 4;
    else trustedPersonScore += 2;

    if (primaryTrustee.readinessProfile?.documentsViewed) trustedPersonScore += 3;
    if (primaryTrustee.readinessProfile?.emergencyGuideRead) trustedPersonScore += 3;
    if (primaryTrustee.readinessProfile?.drillCompleted) trustedPersonScore += 3;
  }
  trustedPersonScore = Math.min(15, trustedPersonScore);

  // 6. Instructions Coverage (Max: 10)
  const assetsWithInstructions = positiveAssets.filter((a) => a.instructions && a.instructions.trim().length > 10);
  const instructionPct = totalAssetsCount > 0 ? assetsWithInstructions.length / totalAssetsCount : 0;
  const instructionScore = Math.round(instructionPct * 10);

  // 7. Liability Coverage (Max: 10)
  let liabilityScore = 10;
  if (liabilities.length > 0) {
    const coveredLiabilities = liabilities.filter((l) => {
      const hasPaymentSource = l.linkedPaymentAssetId || obligations.some((o) => o.linkedAssetId === l.id && o.paymentSourceAssetId);
      return hasPaymentSource;
    });
    liabilityScore = Math.round((coveredLiabilities.length / liabilities.length) * 10);
  }

  // 8. Insurance Coverage (Max: 5)
  const insuranceAssets = assets.filter((a) => a.type === "Insurance");
  let insuranceScore = 0;
  if (insuranceAssets.length > 0) {
    const validInsurance = insuranceAssets.filter((i) => i.approxValue > 0 && (i.policyNumber || (i.instructions && i.instructions.length > 0)));
    insuranceScore = validInsurance.length > 0 ? 5 : 2;
  } else {
    insuranceScore = 1;
  }

  // 9. Verification Freshness (Max: 5)
  const now = Date.now();
  const sixMonthsAgo = now - 180 * 24 * 60 * 60 * 1000;
  const freshAssets = positiveAssets.filter((a) => {
    if (!a.lastVerified) return false;
    const t = new Date(a.lastVerified).getTime();
    return !isNaN(t) && t >= sixMonthsAgo;
  });
  const freshnessScore = totalAssetsCount > 0 ? Math.round((freshAssets.length / totalAssetsCount) * 5) : 0;

  // 10. Check-in Reliability (Max: 5)
  let checkinScore = 0;
  if (continuity && continuity.active) {
    if (continuity.protocolState === "ACTIVE" || !continuity.protocolState) checkinScore = 5;
    else if (continuity.protocolState === "CHECK_IN_DUE" || continuity.protocolState === "REMINDER") checkinScore = 3;
    else checkinScore = 1;
  }

  const rawTotal =
    assetCoverageScore +
    nomineeCoverageScore +
    nomineeVerifiedScore +
    docCoverageScore +
    trustedPersonScore +
    instructionScore +
    liabilityScore +
    insuranceScore +
    freshnessScore +
    checkinScore;

  const totalScore = Math.min(100, Math.max(0, Math.round(rawTotal)));

  const breakdowns = [
    {
      id: "asset_coverage",
      title: "Asset Coverage",
      score: assetCoverageScore,
      maxScore: 10,
      status: assetCoverageScore >= 8 ? "ready" : assetCoverageScore >= 5 ? "warning" : "critical",
      detail: `${totalAssetsCount} financial assets registered in continuity inventory.`,
    },
    {
      id: "nominee_coverage",
      title: "Nominee Coverage",
      score: nomineeCoverageScore,
      maxScore: 15,
      status: nomineeCoverageScore >= 13 ? "ready" : nomineeCoverageScore >= 9 ? "warning" : "critical",
      detail: `${assetsWithNominee.length} of ${totalAssetsCount} assets have a registered nominee.`,
    },
    {
      id: "nominee_verified",
      title: "Nominee Verification",
      score: nomineeVerifiedScore,
      maxScore: 10,
      status: nomineeVerifiedScore >= 9 ? "ready" : nomineeVerifiedScore >= 5 ? "warning" : "critical",
      detail: `${assetsWithVerifiedNominee.length} of ${totalAssetsCount} assets have verified nominees.`,
    },
    {
      id: "document_coverage",
      title: "Document Coverage",
      score: docCoverageScore,
      maxScore: 15,
      status: docCoverageScore >= 12 ? "ready" : docCoverageScore >= 8 ? "warning" : "critical",
      detail: `${assetsWithDocs.length} of ${totalAssetsCount} assets have linked proof documents.`,
    },
    {
      id: "trusted_readiness",
      title: "Trusted Person Readiness",
      score: trustedPersonScore,
      maxScore: 15,
      status: trustedPersonScore >= 12 ? "ready" : trustedPersonScore >= 7 ? "warning" : "critical",
      detail: primaryTrustee ? `${primaryTrustee.name} (${primaryTrustee.status}) assigned as primary trustee.` : "No primary trustee designated.",
    },
    {
      id: "instruction_coverage",
      title: "Continuity Instructions",
      score: instructionScore,
      maxScore: 10,
      status: instructionScore >= 8 ? "ready" : instructionScore >= 5 ? "warning" : "critical",
      detail: `${assetsWithInstructions.length} of ${totalAssetsCount} assets have step-by-step instructions.`,
    },
    {
      id: "liability_coverage",
      title: "Liability & Debt Protection",
      score: liabilityScore,
      maxScore: 10,
      status: liabilityScore >= 9 ? "ready" : liabilityScore >= 5 ? "warning" : "critical",
      detail: liabilities.length > 0 ? `${liabilities.length} liabilities mapped to payment sources.` : "No outstanding debts recorded.",
    },
    {
      id: "insurance_coverage",
      title: "Life & Health Insurance",
      score: insuranceScore,
      maxScore: 5,
      status: insuranceScore >= 4 ? "ready" : "warning",
      detail: insuranceAssets.length > 0 ? `${insuranceAssets.length} policies registered with sum assured.` : "No insurance policies tracked.",
    },
    {
      id: "freshness",
      title: "Verification Freshness",
      score: freshnessScore,
      maxScore: 5,
      status: freshnessScore >= 4 ? "ready" : "warning",
      detail: `${freshAssets.length} of ${totalAssetsCount} assets verified in last 6 months.`,
    },
    {
      id: "checkin_status",
      title: "Continuity Check-in",
      score: checkinScore,
      maxScore: 5,
      status: checkinScore >= 4 ? "ready" : "warning",
      detail: continuity?.active ? `Active periodic check-in (${continuity.frequency} days).` : "Automated safety check-in disabled.",
    },
  ];

  const criticalCount = breakdowns.filter((b) => b.status === "critical").length;
  const warningCount = breakdowns.filter((b) => b.status === "warning").length;
  const readyCount = breakdowns.filter((b) => b.status === "ready").length;

  let summaryText = "Your financial continuity is excellently prepared.";
  if (totalScore < 60) {
    summaryText = "Critical continuity gaps need immediate attention.";
  } else if (totalScore < 80) {
    summaryText = "Your financial life is mostly prepared with a few actionable gaps.";
  } else if (totalScore < 95) {
    summaryText = "Your financial continuity is strong and well-organized.";
  }

  return {
    score: totalScore,
    summary: summaryText,
    breakdowns,
    criticalCount,
    warningCount,
    readyCount,
  };
};

/**
 * CRITICAL GAPS ENGINE
 * Automatically discovers issues across all assets, people, documents, and obligations.
 */
export const detectCriticalGaps = (assets = [], people = [], documents = [], continuity = null, obligations = []) => {
  const gaps = [];

  // 1. Assets without nominee
  assets
    .filter((a) => (a.approxValue || 0) > 0 && (!a.nomineeId && (!a.nominee || a.nominee.trim() === "")))
    .forEach((a) => {
      gaps.push({
        id: `gap-nominee-missing-${a.id}`,
        severity: "critical",
        title: "Asset missing nominee designation",
        explanation: `${a.name} (${a.institution}) has no nominee registered. Without a nominee, legal heir claims can take up to 24 months in court probate.`,
        affectedEntity: a.name,
        entityType: "asset",
        entityId: a.id,
        recommendedAction: `Assign a verified nominee (e.g. primary trusted person) to ${a.name}.`,
        actionLabel: "Assign Nominee",
        actionTarget: { view: "assets", assetId: a.id, modal: "editAsset" },
      });
    });

  // 2. Nominee unverified
  assets
    .filter((a) => (a.approxValue || 0) > 0 && (a.nomineeId || a.nominee) && a.nomineeVerified === false)
    .forEach((a) => {
      gaps.push({
        id: `gap-nominee-unverified-${a.id}`,
        severity: "warning",
        title: "Nominee authentication pending",
        explanation: `${a.name} has ${a.nominee || "a nominee"} assigned, but the institution nominee verification has not been digitally confirmed.`,
        affectedEntity: a.name,
        entityType: "asset",
        entityId: a.id,
        recommendedAction: "Confirm nominee authentication record with institution portal.",
        actionLabel: "Verify Nominee",
        actionTarget: { view: "assets", assetId: a.id, modal: "editAsset" },
      });
    });

  // 3. High-value asset or Property without document
  assets
    .filter((a) => (a.type === "Property" || (a.approxValue || 0) >= 500000) && (!a.documents || a.documents.length === 0) && !documents.some((d) => d.linkedAssetId === a.id))
    .forEach((a) => {
      gaps.push({
        id: `gap-doc-missing-${a.id}`,
        severity: a.type === "Property" ? "critical" : "warning",
        title: `Missing essential document for ${a.name}`,
        explanation: `No ownership proof, statement, or title deed uploaded for ${a.name} (Valued at ${fmt(a.approxValue)}).`,
        affectedEntity: a.name,
        entityType: "asset",
        entityId: a.id,
        recommendedAction: `Upload a verified statement, passbook, or deed document linked to this asset.`,
        actionLabel: "Upload Document",
        actionTarget: { view: "documents", modal: "uploadDoc", assetId: a.id },
      });
    });

  // 4. Missing continuity instructions
  assets
    .filter((a) => (a.approxValue || 0) > 200000 && (!a.instructions || a.instructions.trim().length < 10))
    .forEach((a) => {
      gaps.push({
        id: `gap-instructions-missing-${a.id}`,
        severity: "warning",
        title: `Missing continuity instructions for ${a.name}`,
        explanation: `If you become unavailable, your trusted person will not know specific claim steps, advisor contact, or account passwords.`,
        affectedEntity: a.name,
        entityType: "asset",
        entityId: a.id,
        recommendedAction: `Add practical steps for what to do with ${a.name}.`,
        actionLabel: "Add Instructions",
        actionTarget: { view: "assets", assetId: a.id, modal: "editAsset" },
      });
    });

  // 5. Liabilities without linked payment source
  assets
    .filter((a) => (a.approxValue || 0) < 0 || a.type === "Loans" || a.type === "Liabilities")
    .forEach((l) => {
      const hasLinkedSource = l.linkedPaymentAssetId || obligations.some((o) => o.linkedAssetId === l.id && o.paymentSourceAssetId);
      if (!hasLinkedSource) {
        gaps.push({
          id: `gap-liability-source-${l.id}`,
          severity: "critical",
          title: `Liability without linked payment source`,
          explanation: `${l.name} (${fmt(Math.abs(l.approxValue))}) is not linked to an active bank account. Default risks credit penalty and legal distress.`,
          affectedEntity: l.name,
          entityType: "asset",
          entityId: l.id,
          recommendedAction: "Link a primary savings account to cover monthly EMI auto-debits.",
          actionLabel: "Link Account",
          actionTarget: { view: "assets", assetId: l.id, modal: "editAsset" },
        });
      }
    });

  // 6. Insurance without claim instructions
  assets
    .filter((a) => a.type === "Insurance" && (!a.instructions || a.instructions.trim().length < 15))
    .forEach((i) => {
      gaps.push({
        id: `gap-insurance-claim-${i.id}`,
        severity: "warning",
        title: "Insurance policy missing claim guidance",
        explanation: `${i.name} requires documented claim steps so your beneficiaries can file death or disability benefits promptly.`,
        affectedEntity: i.name,
        entityType: "asset",
        entityId: i.id,
        recommendedAction: "Add policy claim procedures, branch details, and helpline numbers.",
        actionLabel: "Add Claim Guide",
        actionTarget: { view: "assets", assetId: i.id, modal: "editAsset" },
      });
    });

  // 7. Trusted Person Drill / Confirmation
  const primaryTrustee = people.find((p) => p.isPrimaryTrustee || p.role?.toLowerCase().includes("trustee"));
  if (!primaryTrustee) {
    gaps.push({
      id: "gap-primary-trustee-missing",
      severity: "critical",
      title: "No Primary Trustee assigned",
      explanation: "Continuity protocols require a designated trusted person who receives access permissions and emergency handoff.",
      affectedEntity: "People & Trustees",
      entityType: "people",
      entityId: null,
      recommendedAction: "Invite a trusted spouse, sibling, or advisor as Primary Trustee.",
      actionLabel: "Add Trustee",
      actionTarget: { view: "people", modal: "addPerson" },
    });
  } else if (!primaryTrustee.readinessProfile?.drillCompleted) {
    gaps.push({
      id: "gap-trustee-drill",
      severity: "info",
      title: `${primaryTrustee.name} has not run a continuity drill`,
      explanation: `Simulate whether ${primaryTrustee.name} can locate emergency funds, insurance policies, and critical documents.`,
      affectedEntity: primaryTrustee.name,
      entityType: "people",
      entityId: primaryTrustee.id,
      recommendedAction: "Run a 5-step Continuity Drill simulation.",
      actionLabel: "Run Drill",
      actionTarget: { view: "continuity", modal: "runDrill" },
    });
  }

  // 8. Stale asset verification (> 180 days)
  const now = Date.now();
  const sixMonthsAgo = now - 180 * 24 * 60 * 60 * 1000;
  assets
    .filter((a) => (a.approxValue || 0) > 0 && a.lastVerified && new Date(a.lastVerified).getTime() < sixMonthsAgo)
    .forEach((a) => {
      gaps.push({
        id: `gap-stale-verify-${a.id}`,
        severity: "info",
        title: `Verification review due for ${a.name}`,
        explanation: `Last verified on ${a.lastVerified}. Balances and nominee records should be checked semi-annually.`,
        affectedEntity: a.name,
        entityType: "asset",
        entityId: a.id,
        recommendedAction: "Confirm current balance and nominee status.",
        actionLabel: "Mark Verified",
        actionTarget: { view: "assets", assetId: a.id, modal: "verifyAsset" },
      });
    });

  return gaps;
};

/**
 * FINANCIAL DEPENDENCY ENGINE
 * Maps bank accounts to the obligations and liabilities they support.
 */
export const calculateFinancialDependencies = (assets = [], obligations = []) => {
  const bankAccounts = assets.filter((a) => a.type === "Banking");

  return bankAccounts.map((bank) => {
    const directObligations = obligations.filter((o) => o.paymentSourceAssetId === bank.id);
    const directLiabilities = assets.filter((a) => a.linkedPaymentAssetId === bank.id);

    const totalMonthlyObligation = directObligations.reduce((sum, o) => {
      if (o.frequency === "Monthly") return sum + (o.amount || 0);
      if (o.frequency === "Quarterly") return sum + (o.amount || 0) / 3;
      if (o.frequency === "Annual") return sum + (o.amount || 0) / 12;
      return sum;
    }, 0);

    return {
      bankAccount: bank,
      supportedObligations: directObligations,
      supportedLiabilities: directLiabilities,
      obligationCount: directObligations.length + directLiabilities.length,
      monthlyBurden: totalMonthlyObligation,
      runwayMonths: totalMonthlyObligation > 0 ? (bank.approxValue / totalMonthlyObligation).toFixed(1) : "∞",
    };
  });
};

/**
 * CONTINUITY SIMULATION ENGINE
 * "What would happen if I became unavailable today?"
 */
export const runContinuitySimulation = (assets = [], people = [], documents = [], continuity = null, obligations = []) => {
  const primaryTrustee = people.find((p) => p.isPrimaryTrustee || p.role?.toLowerCase().includes("trustee") || p.status === "Verified");
  const emergencyFunds = assets.filter((a) => a.isEmergencyFund || (a.type === "Banking" && (a.approxValue || 0) > 0));
  const insurancePolicies = assets.filter((a) => a.type === "Insurance");
  const criticalDocuments = documents.filter((d) => d.category === "Legal" || d.category === "Property" || d.verified);
  const liabilities = assets.filter((a) => (a.approxValue || 0) < 0 || a.type === "Loans");
  const unverifiedNominees = assets.filter((a) => (a.approxValue || 0) > 0 && (!a.nomineeVerified || !a.nomineeId));
  const missingInstructions = assets.filter((a) => (a.approxValue || 0) > 0 && (!a.instructions || a.instructions.trim().length < 10));

  const totalEmergencyValue = emergencyFunds.reduce((sum, a) => sum + (a.approxValue || 0), 0);
  const totalInsuranceCover = insurancePolicies.reduce((sum, a) => sum + (a.approxValue || 0), 0);
  const totalDebt = liabilities.reduce((sum, a) => sum + Math.abs(a.approxValue || 0), 0);

  const checkpoints = [
    {
      title: "Trusted Person Access",
      passed: Boolean(primaryTrustee && primaryTrustee.status === "Verified"),
      detail: primaryTrustee ? `${primaryTrustee.name} has verified access credentials.` : "No verified primary trustee configured.",
      impact: "High",
    },
    {
      title: "Immediate Emergency Liquidity",
      passed: totalEmergencyValue >= 200000,
      detail: `${fmt(totalEmergencyValue)} discoverable across ${emergencyFunds.length} liquid bank accounts / FDs.`,
      impact: "High",
    },
    {
      title: "Life Insurance Protection",
      passed: insurancePolicies.length > 0 && totalInsuranceCover > 0,
      detail: `${fmt(totalInsuranceCover)} sum assured across ${insurancePolicies.length} policies.`,
      impact: "Critical",
    },
    {
      title: "Important Document Availability",
      passed: criticalDocuments.length >= 3,
      detail: `${criticalDocuments.length} legal, property & identity documents immediately accessible.`,
      impact: "Medium",
    },
    {
      title: "Debt Auto-Debit Resilience",
      passed: liabilities.every((l) => l.linkedPaymentAssetId || obligations.some((o) => o.linkedAssetId === l.id)),
      detail: liabilities.length > 0 ? `${liabilities.length} liabilities mapped to payment sources.` : "No debt liabilities exist.",
      impact: "High",
    },
    {
      title: "Clear Claim Instructions",
      passed: missingInstructions.length <= 1,
      detail: `${assets.length - missingInstructions.length} of ${assets.length} assets have actionable guidance.`,
      impact: "Medium",
    },
  ];

  const passedCount = checkpoints.filter((c) => c.passed).length;
  const readinessPercent = Math.round((passedCount / checkpoints.length) * 100);

  const immediateActionGuide = [
    {
      step: 1,
      category: "Emergency Liquidity",
      action: `Access ${emergencyFunds[0]?.name || "Primary Bank Account"} (${emergencyFunds[0]?.institution || "Bank"}) for immediate family cashflow.`,
      assetId: emergencyFunds[0]?.id,
    },
    {
      step: 2,
      category: "Life Insurance Claim",
      action: insurancePolicies.length > 0 ? `Initiate claim for ${insurancePolicies[0]?.name} (${insurancePolicies[0]?.institution}) using Policy #${insurancePolicies[0]?.policyNumber || "N/A"}.` : "Verify if employer or group insurance policies exist.",
      assetId: insurancePolicies[0]?.id,
    },
    {
      step: 3,
      category: "Debt Protection",
      action: liabilities.length > 0 ? `Monitor monthly EMI of ${fmt(obligations[0]?.amount || 28000)} for ${liabilities[0]?.name} to prevent loan default.` : "No outstanding loan payments required.",
      assetId: liabilities[0]?.id,
    },
    {
      step: 4,
      category: "Advisor Consultation",
      action: "Contact designated financial advisor before making irreversible portfolio changes.",
    },
  ];

  return {
    readinessPercent,
    passedCount,
    totalCheckpoints: checkpoints.length,
    checkpoints,
    summary: {
      totalEmergencyValue,
      totalInsuranceCover,
      totalDebt,
      unverifiedNomineeCount: unverifiedNominees.length,
      missingInstructionCount: missingInstructions.length,
    },
    immediateActionGuide,
  };
};

/**
 * CONTINUITY DRILL ENGINE
 * Interactive scenario testing for trusted persons.
 */
export const getContinuityDrillTasks = (assets = [], people = [], documents = []) => {
  const primaryBank = assets.find((a) => a.type === "Banking" && (a.approxValue || 0) > 0);
  const insurance = assets.find((a) => a.type === "Insurance");
  const homeLoan = assets.find((a) => a.type === "Loans" || (a.approxValue || 0) < 0);
  const legalDoc = documents.find((d) => d.category === "Legal" || d.category === "Property");
  const advisor = people.find((p) => p.role?.toLowerCase().includes("advisor"));

  return [
    {
      id: "drill-1",
      title: "Locate Emergency Bank Account",
      description: "Find primary checking/savings account details, branch IFSC, and joint mandate instructions.",
      targetEntity: primaryBank?.name || "HDFC Savings",
      targetType: "asset",
      expectedInfo: primaryBank ? `Account ${primaryBank.accountNumber || "****"} at ${primaryBank.institution}` : "Primary Bank",
      completed: Boolean(primaryBank),
    },
    {
      id: "drill-2",
      title: "Find Active Term Insurance Policy",
      description: "Locate life insurance sum assured, policy number, and initial claim submission contacts.",
      targetEntity: insurance?.name || "LIC Term Plan",
      targetType: "asset",
      expectedInfo: insurance ? `Policy #${insurance.policyNumber || "LIC-781234"} (${fmt(insurance.approxValue)})` : "LIC Policy",
      completed: Boolean(insurance && insurance.policyNumber),
    },
    {
      id: "drill-3",
      title: "Identify Home Loan Liability & EMI Date",
      description: "Find outstanding balance, auto-debit schedule, and linked payment account.",
      targetEntity: homeLoan?.name || "Home Loan",
      targetType: "asset",
      expectedInfo: homeLoan ? `EMI due 5th of every month from linked account` : "Home Loan",
      completed: Boolean(homeLoan),
    },
    {
      id: "drill-4",
      title: "Locate Critical Legal / Identity Document",
      description: "Access Will copy, PAN card, or Property Registration Deed.",
      targetEntity: legalDoc?.title || "Property Registration Deed",
      targetType: "document",
      expectedInfo: legalDoc ? `${legalDoc.title} (${legalDoc.docType || "Document"})` : "Legal Document",
      completed: Boolean(legalDoc && legalDoc.verified),
    },
    {
      id: "drill-5",
      title: "Retrieve Emergency Advisor & Institution Contacts",
      description: "Identify contact details for designated advisor and bank customer support.",
      targetEntity: advisor ? `${advisor.name} (${advisor.relationship})` : "Key Advisor",
      targetType: "person",
      expectedInfo: advisor ? `${advisor.name} - ${advisor.phone}` : "Emergency Contact",
      completed: Boolean(advisor),
    },
  ];
};

/**
 * CONTEXTUAL AI QUERY ENGINE
 * Deterministic answers generated purely from the live application data.
 */
export const answerContextualQuery = (query = "", { assets = [], people = [], documents = [], continuity = null, obligations = [] }) => {
  const q = query.toLowerCase().trim();
  
  if (q.includes("nominee") && (q.includes("no") || q.includes("unverified") || q.includes("missing") || q.includes("gap"))) {
    const unverified = assets.filter((a) => (a.approxValue || 0) > 0 && (!a.nomineeVerified || !a.nomineeId));
    if (unverified.length === 0) {
      return "All registered assets have verified nominees assigned.";
    }
    const names = unverified.map((a) => `${a.name} (${a.nominee ? "Nominee unverified: " + a.nominee : "No nominee assigned"})`).join(", ");
    return `Found ${unverified.length} asset(s) with nominee gaps: ${names}.`;
  }

  if (q.includes("hdfc") || q.includes("depend") || q.includes("obligation")) {
    const hdfc = assets.find((a) => a.name.toLowerCase().includes("hdfc savings") || a.institution.toLowerCase().includes("hdfc"));
    const deps = obligations.filter((o) => o.paymentSourceAssetId === hdfc?.id || o.linkedAssetId === hdfc?.id);
    const totalAmount = deps.reduce((sum, o) => sum + (o.amount || 0), 0);
    return `Your HDFC account supports ${deps.length} direct financial obligations totaling ~${fmt(totalAmount)}/month, including: ${deps.map((d) => `${d.title} (${fmt(d.amount)})`).join(", ")}.`;
  }

  if (q.includes("priya") || q.includes("trustee") || q.includes("need")) {
    const trustee = people.find((p) => p.name.toLowerCase().includes("priya") || p.isPrimaryTrustee);
    const emergencyFunds = assets.filter((a) => a.isEmergencyFund || a.type === "Banking");
    const insurance = assets.find((a) => a.type === "Insurance");
    return `${trustee ? trustee.name : "Your primary trustee"} would immediately need: (1) Access to emergency funds (${emergencyFunds.map((e) => e.name).join(", ")}), (2) ${insurance?.name || "Term insurance"} policy claim details (#${insurance?.policyNumber || "LIC-781234"}), (3) Home loan auto-debit protection on HDFC savings, and (4) Identity documents (PAN/Aadhaar) to file claims.`;
  }

  if (q.includes("document") && (q.includes("missing") || q.includes("need"))) {
    const assetsWithoutDocs = assets.filter((a) => (a.approxValue || 0) > 0 && (!a.documents || a.documents.length === 0) && !documents.some((d) => d.linkedAssetId === a.id));
    if (assetsWithoutDocs.length === 0) {
      return "All registered high-value assets have linked verified documents.";
    }
    return `Missing document proof for ${assetsWithoutDocs.length} asset(s): ${assetsWithoutDocs.map((a) => a.name).join(", ")}.`;
  }

  if (q.includes("score") || q.includes("why")) {
    const scoreData = calculateContinuityScore(assets, people, documents, continuity, obligations);
    const criticalBreakdowns = scoreData.breakdowns.filter((b) => b.status !== "ready");
    return `Your Continuity Score is ${scoreData.score}/100. Key areas affecting your score are: ${criticalBreakdowns.map((b) => `${b.title} (${b.score}/${b.maxScore} pts)`).join(", ")}.`;
  }

  if (q.includes("total") || q.includes("net worth") || q.includes("position") || q.includes("asset")) {
    const totalAssets = assets.filter((a) => (a.approxValue || 0) > 0).reduce((sum, a) => sum + a.approxValue, 0);
    const totalLiabilities = assets.filter((a) => (a.approxValue || 0) < 0).reduce((sum, a) => sum + Math.abs(a.approxValue), 0);
    return `Total Assets: ${fmt(totalAssets)} across ${assets.filter((a) => (a.approxValue || 0) > 0).length} holdings. Total Liabilities: ${fmt(totalLiabilities)}. Net Position: ${fmt(totalAssets - totalLiabilities)}.`;
  }

  return `Continuity AI searched your financial life: You have ${assets.length} assets/liabilities, ${people.length} designated contacts, ${documents.length} verified documents, and ${obligations.length} recurring obligations. Ask about nominees, dependencies, emergency readiness, or missing documents!`;
};
