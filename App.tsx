
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { Dashboard } from './components/Dashboard';
import { Phase, Message, ProjectInfo, ProcessingStep } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat'>('dashboard');
  const [phase, setPhase] = useState<Phase>(Phase.IDLE);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentSteps, setCurrentSteps] = useState<ProcessingStep[]>([]);
  const [workflowType, setWorkflowType] = useState<'procure' | 'event' | null>(null);
  
  const projectInfo: ProjectInfo = {
    user: "Dr. Palacios",
    projects: [
      {
        name: "NIH-BR-2024",
        funder: "NIH",
        grantId: "Grant #2024-BR-UCSD",
        utilization: 85
      },
      {
        name: "NSF-PHY-2025",
        funder: "NSF",
        grantId: "Grant #2025-PHY-NSF",
        utilization: 50
      }
    ]
  };

  const startWorkflow = (type: 'procure' | 'event') => {
    setWorkflowType(type);
    setActiveTab('chat');
    setPhase(Phase.IDLE);
    
    let greeting: Message;
    if (type === 'procure') {
      greeting = {
        id: 'init-procure',
        role: 'agent',
        content: "Hello Dr. Palacios. I am **TritonProcure**, your SmartProcure AI Agent at UC San Diego. I am ready to assist with your procurement needs. How can I help you today?",
        actions: ["Place An Order", "Check Order Status", "Other"],
        timestamp: new Date()
      };
    } else {
      greeting = {
        id: 'init-event',
        role: 'agent',
        content: "Hello Dr. Palacios. I am ready to help you **Plan an Event**. I'll manage venues, catering, and ensure we stay within entertainment policy. What are we organizing today?",
        actions: ["Department Symposium", "Guest Speaker Lunch", "Retreat Planning"],
        timestamp: new Date()
      };
    }
    setMessages([greeting]);
  };

  const runProcessingSteps = async (steps: string[]) => {
    setIsTyping(true);
    const initialSteps: ProcessingStep[] = steps.map((s, i) => ({
      id: i.toString(),
      label: s,
      status: i === 0 ? 'active' : 'pending'
    }));
    
    setCurrentSteps(initialSteps);

    for (let i = 0; i < steps.length; i++) {
      setCurrentSteps(prev => prev.map((step, idx) => {
        if (idx < i) return { ...step, status: 'complete' };
        if (idx === i) return { ...step, status: 'active' };
        return step;
      }));
      
      const isLastStep = i === steps.length - 1;
      const isOracleIntegration = (phase === Phase.COMPLIANCE || phase === Phase.EVENT_SPEAKER_FINALIZE || phase === Phase.FUNDING_CHECK || phase === Phase.TAX_EXEMPTION_Q2) && isLastStep;
      
      const delay = isOracleIntegration 
        ? 4500 
        : 2200 + Math.random() * 1000; 
        
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    setCurrentSteps(prev => prev.map(step => ({ ...step, status: 'complete' })));
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsTyping(false);
    setCurrentSteps([]);
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    const steps = getStepsForPhase(phase, text);
    await runProcessingSteps(steps);
    processNextPhase(text);
  };

  const getStepsForPhase = (currentPhase: Phase, userInput: string): string[] => {
    if (workflowType === 'event') {
      switch (currentPhase) {
        case Phase.IDLE:
          return [
            "Parsing Event Requirements...",
            "Validating SIO Forum Facility Policies",
            "Cross-referencing Venue Availability",
            "Checking Risk Management Thresholds"
          ];
        case Phase.EVENT_VENUE_CHECK:
          return [
            "Applying Entertainment Policy (BUS-79)",
            "Querying Agreement Suppliers (Rentals/Valet)",
            "Checking Catering Compliance (Saltaire Partnership)",
            "Calculating Per-Person Maximums"
          ];
        case Phase.EVENT_POLICY_GUIDANCE:
          return [
            "Verifying Speaker Engagement Criteria",
            "Preparing Payment Request Template",
            "Mapping Documentation Requirements (Invoice/W9)"
          ];
        case Phase.EVENT_SPEAKER_FORM:
          return [
            "Finalizing Payment Request for Oracle",
            "Uploading Documentation to Financial Cloud",
            "Routing to Departmental Approval Queue"
          ];
        default:
          return ["Optimizing Workflow...", "Syncing with Oracle ERP"];
      }
    }

    switch (currentPhase) {
      case Phase.IDLE:
        return [
          "Parsing Procurement Intent...",
          "Identifying Category (High-Value Research)",
          "Cross-referencing Oracle Commodity Codes",
          "Flagging Missing Technical Specs"
        ];
      case Phase.SPEC_CHECK:
        return [
          "Querying CoreBio Asset Registry...",
          "Scanning York Hall Shared Equipment Database",
          "Analyzing Utilization Data",
          "Calculating Sustainability Parity Score"
        ];
      case Phase.INVENTORY_CHECK:
        if (userInput.toLowerCase().includes("no") || userInput.toLowerCase().includes("own")) {
          return [
            "Fetching Active Grants from Oracle PPM...",
            "Identifying Eligible Funds (NIH/NSF)",
            "Preparing Budget Selection Interface"
          ];
        }
        return ["Rerouting to Shared Asset Protocol...", "Contacting Resource Custodian"];
      case Phase.FUNDING_CHECK:
        return [
          "Accessing Oracle PPM Funding Module...",
          "Validating Budget Availability...",
          "Checking Grant Expiration Dates...",
          "Verifying Allowability for Spend Category (5000+)"
        ];
      case Phase.COMPARISON:
        return [
          "Building Requisition Header in Oracle Finanical Cloud",
          "Verifying Fund Availability via Oracle PPM",
          "Executing SSJPR (Sole Source) Generation Engine",
          "Establishing Secure Handshake with Oracle Financial Cloud...",
          "Provisioning Requisition..."
        ];
      case Phase.TAX_EXEMPTION_INIT:
        return [
          "Loading California Tax Board Regulations...",
          "Cross-referencing Item Category..."
        ];
      case Phase.TAX_EXEMPTION_Q1:
        return [
          "Analyzing Usage Responses...",
          "Verifying NAICS Code 541711..."
        ];
      case Phase.TAX_EXEMPTION_Q2:
        return [
          "Generating CDTFA-230-M Certificate...",
          "Recalculating PO Total...",
          "Establishing Secure Handshake with Oracle Financial Cloud..."
        ];
      case Phase.COMPLIANCE:
        return [
          "Finalizing Compliance Audit Log...",
          "Routing for Financial Approval (Oracle Workflow)..."
        ];
      default:
        return ["Optimizing Workflow...", "Syncing with Oracle ERP"];
    }
  };

  const processNextPhase = (userInput: string) => {
    let response: Message = {
      id: (Date.now() + 1).toString(),
      role: 'agent',
      content: '',
      timestamp: new Date()
    };

    if (workflowType === 'event') {
      switch (phase) {
        case Phase.IDLE:
          response.content = "The SIO Forum is a fantastic venue. Since this is a specialized facility, I need to check the guest list composition for policy compliance. \n\n**Are the attendees primarily students, faculty/staff, or external donors?**";
          response.actions = ["Fundraising (Donors/Staff)", "Academic Conference", "Internal Meeting"];
          setPhase(Phase.EVENT_VENUE_CHECK);
          break;

        case Phase.EVENT_VENUE_CHECK:
          response.content = "Excellent. Since the nature of the event is **Fundraising** for Employees and Donors, I've identified the appropriate Triton-Preferred suppliers and policy requirements:\n\n" +
            "• **Rentals**: Use *Abbey Party Rentals* (Agreement Supplier). Reach out for a quote, then I'll generate the PO.\n\n" +
            "• **Valets**: Use *Ace Parking* (Preferred Partner). Request a quote for the specific guest count.\n\n" +
            "• **Catering**: Redirect to **Saltaire**. \n\n&nbsp;&nbsp;&nbsp;&nbsp;*Note: Current meal maximums are $31 (Breakfast), $54 (Lunch), $94 (Dinner). Ensure guest list is attached for donor compliance.*\n\n" +
            "• **Speaker**: To compensate your speaker, we will create a **Payment Request**.\n\n\n" +
            "Are you ready to draft your payment request for the speaker?";
          response.actions = ["Start Payment Request", "Not yet"];
          setPhase(Phase.EVENT_POLICY_GUIDANCE);
          break;

        case Phase.EVENT_POLICY_GUIDANCE:
          if (userInput.toLowerCase().includes("start")) {
            response.content = "Great. Since I already have the event details for **SIO** on **3/1/2026**, I just need to know:\n\n" +
              "1. **Who is the speaker?**\n" +
              "I'll also need you to attach the invoice or appropriate documentation once we finalize.";
            setPhase(Phase.EVENT_SPEAKER_FORM);
          } else {
            response.content = "No problem. I've saved these supplier recommendations to your dashboard under 'Draft Events'. Let me know when you're ready to proceed.";
            setPhase(Phase.FINISHED);
          }
          break;

        case Phase.EVENT_SPEAKER_FORM:
          response.content = "✅ **Payment Request successfully drafted in Oracle Financial Cloud.**\n\nI have populated the location (SIO Forum) and the date from our records. The invoice has been attached for processing. \n\n**Invoice #00236823** is now routing to your Departmental Approver.";
          setPhase(Phase.FINISHED);
          break;

        default:
          response.content = "The event workflow is complete. How else can I assist with your planning today?";
      }
      setMessages(prev => [...prev, response]);
      return;
    }

    // Procurement Workflow
    switch (phase) {
      case Phase.IDLE:
        response.content = "I can certainly assist with that. To ensure technical parity and correct sourcing for a electron microscope, I'll need a few more technical specifications. Could you please provide the required **Resolution (nm)** and **Operating Voltage (kV)**?";
        setPhase(Phase.SPEC_CHECK);
        break;

      case Phase.SPEC_CHECK:
        response.content = "⚠️ **Attention!** \n\nI scanned the campus-wide asset inventory and found **2 matching units** currently underutilized in the Biology Department (York Hall Cluster). \n\nWould you like to request access to share these resources instead of purchasing new equipment? This helps our **sustainability goal** and **saves** your project budget!";
        response.actions = ["Yes, share resource", "No, I need my own"];
        setPhase(Phase.INVENTORY_CHECK);
        break;

      case Phase.INVENTORY_CHECK:
        if (userInput.toLowerCase().includes("no") || userInput.toLowerCase().includes("own")) {
          response.content = "Understood. Policy requires selecting a funding source before we can query approved supplier catalogs and pricing. Which active project would you like to use?";
          response.actions = ["Charge to NIH-BR-2024", "Charge to NSF-PHY-2025"];
          setPhase(Phase.FUNDING_CHECK);
        } else {
          response.content = "Excellent choice. Initiating Resource Share request with Dr. Smith's lab in Biology. You've saved **$68,500** in project funds.";
          setPhase(Phase.FINISHED);
        }
        break;

      case Phase.FUNDING_CHECK:
        const selectedProject = userInput.includes("NIH") ? "NIH-BR-2024" : "NSF-PHY-2025";
        response.thoughtProcess = "DETECT: Funding source selected. ACTION: Verifying allowable equipment categories on selected grant. QUERYING: Approved institutional supplier catalogs for specified PTA.";
        response.content = `Budget check passed for **${selectedProject}**. Based on this funding source's approved catalogs, I have retrieved the best sourcing options for your specifications:`;
        response.metadata = {
          type: 'comparison',
          options: [
            { label: 'Non-Contracted (User Choice)', price: '$68,500', shipping: '4-6 Weeks', compliance: 'New Vendor Setup Required', risk: 'High' },
            { label: 'Triton Recommended (ThermoFisher)', price: '$58,500', shipping: '1 Week', compliance: 'Pre-negotiated Warranty', risk: 'Low' }
          ]
        };
        response.actions = ["Select Triton Recommended", "Proceed with Non-Contracted"];
        break;

      case Phase.COMPARISON:
        response.thoughtProcess = "DETECT: Supplier selected. ACTION: Flagging potential CA Partial Sales Tax Exemption based on department Life Sciences R&D registration.";
        response.content = "I see you've selected the ThermoFisher equipment ($58,500). Based on your department’s registration (Life Sciences R&D), this item may qualify for the California Partial Sales Tax Exemption, which would save you approximately $2,303 on this transaction.\n\nWould you like me to verify eligibility and generate the exemption certificate for the vendor?";
        response.actions = ["Yes, let's do that", "No, skip exemption"];
        setPhase(Phase.TAX_EXEMPTION_INIT);
        break;

      case Phase.TAX_EXEMPTION_INIT:
        response.thoughtProcess = "DETECT: Exemption verification initiated. ACTION: Loading CA Board of Equalization Reg 1525.4 criteria.";
        response.content = "Great. To ensure high-compliance and minimize audit risk, I just need to confirm three things:\n\n1. **Useful Life:** Will this equipment be used in your lab for at least one year?\n2. **Usage:** Will it be used 50% or more of the time for R&D activities here in California?\n3. **Exclusion Check:** Is this item strictly for research, or will it be used for administrative or marketing purposes?";
        setPhase(Phase.TAX_EXEMPTION_Q1);
        break;

      case Phase.TAX_EXEMPTION_Q1:
        response.thoughtProcess = "EVALUATE: Criteria 1-3 met. ACTION: Verifying NAICS code alignment.";
        response.content = "Perfect. One final compliance check: Our records show your primary NAICS code is 541711 (Biotech R&D). Does this purchase support an activity where you are discovering information that is technological in nature for a new or improved business component?";
        setPhase(Phase.TAX_EXEMPTION_Q2);
        break;

      case Phase.TAX_EXEMPTION_Q2:
        response.thoughtProcess = "EXECUTE: Generate form CDTFA-230-M. ATTACH: Purchase Order. RECALCULATE: Taxes.";
        response.content = "Eligibility confirmed.\n\n• **Compliance Status:** High (Meets Reg. 1525.4 criteria).\n\n• **Tax Impact:** Applied 3.9375% reduction to the state portion.\n\n• **Action:** I have generated the CDTFA-230-M certificate and attached it to your Requistion Order. The vendor will receive this automatically.\n\nYour estimated total has been updated from $58,500 to $56,197. \n\n **Ready to submit?**";
        response.actions = ["Submit Requisition"];
        setPhase(Phase.COMPLIANCE);
        break;

      case Phase.COMPLIANCE:
        response.content = "Excellent. I am auto-generating the required compliance documentation and routing this through **Oracle Financial Cloud**.";
        response.metadata = {
          type: 'compliance_checklist',
          items: [
            { text: "Price > $5,000 → Flagged as Inventorial Equipment", status: 'done' },
            { text: "SSJPR (Sole Source) Generated: Validated against Chemistry Department historicals", status: 'done' }
          ]
        };
        
        setTimeout(() => {
          const poMsg: Message = {
            id: 'po-final',
            role: 'agent',
            content: "✅ **Requisition successfully submitted to Oracle Cloud.** \n\n**Requisition #REQ0218927** has been created. The supplier has been notified via the B2B portal. Tracking information will be updated in your dashboard shortly.",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, poMsg]);
        }, 4000);
        setPhase(Phase.FINISHED);
        break;
      
      default:
        response.content = "Process complete. How else can I assist with your procurement pipeline today?";
    }

    setMessages(prev => [...prev, response]);
  };

  const getActiveSessionName = () => {
    if (workflowType === 'procure') return "Procurement Assistant";
    if (workflowType === 'event') return "Event Coordinator";
    return null;
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900">
      <Sidebar projectInfo={projectInfo} activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-slate-200 bg-white flex items-center justify-between px-8 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
            {getActiveSessionName() && (
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left duration-500">
                <span className="text-xs font-semibold text-slate-400">Active Session:</span>
                <div className="flex items-center gap-2 bg-blue-50/80 border border-blue-100 rounded-full px-4 py-2 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-ucsd-blue tracking-tight">
                    {getActiveSessionName()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-700">{projectInfo.user}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">PI • Biology Department</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden ring-1 ring-slate-100">
              <img src="https://picsum.photos/seed/drpalacios/100/100" alt="Avatar" />
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' ? (
          <Dashboard onStartWorkflow={startWorkflow} />
        ) : (
          <ChatArea 
            messages={messages} 
            isTyping={isTyping} 
            processingSteps={currentSteps}
            phase={phase}
            userName={projectInfo.user}
            onSendMessage={handleSendMessage} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
