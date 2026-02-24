
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
  const [taskCount, setTaskCount] = useState<number>(0);
  
  const projectInfo: ProjectInfo = {
    user: "Dr. Palacios",
    projects: [
      {
        name: "2028517-SP SHAH NIH R01AR081887",
        funder: "NIH",
        grantId: "2028517-SP SHAH NIH",
        utilization: 75
      },
      {
        name: "2025433-SP Pui NSF CNS-2212241",
        funder: "NSF",
        grantId: "2025433-SP Pui NSF",
        utilization: 50
      },
      {
        name: "1015411-OTHR Symposium Fund",
        funder: "GEN",
        grantId: "1x Symposium Operating Fund #2026",
        utilization: 62
      }
    ]
  };

  // State Reset when returning to dashboard
  useEffect(() => {
    if (activeTab === 'dashboard') {
      setMessages([]);
      setPhase(Phase.IDLE);
      setWorkflowType(null);
      setTaskCount(0);
      setCurrentSteps([]);
      setIsTyping(false);
    }
  }, [activeTab]);

  const runProcessingSteps = async (steps: string[], targetPhase: Phase) => {
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
      const isOracleIntegration = (targetPhase === Phase.COMPLIANCE || targetPhase === Phase.EVENT_SPEAKER_FINALIZE || targetPhase === Phase.FUNDING_CHECK || targetPhase === Phase.TAX_EXEMPTION_Q2 || targetPhase === Phase.EVENT_FUNDING_CHECK) && isLastStep;
      
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

  const getStepsForPhase = (currentPhase: Phase, userInput: string, workflowOverride?: 'procure' | 'event'): string[] => {
    const activeWorkflow = workflowOverride || workflowType;
    if (activeWorkflow === 'event') {
      switch (currentPhase) {
        case Phase.IDLE:
          return [
            "Parsing Event Requirements...",
            "Validating SIO Forum Facility Policies...",
            "Cross-referencing Venue Availability..."
          ];
        case Phase.EVENT_VENUE_CHECK:
          return ["Preparing Event Integrations..."];
        case Phase.EVENT_RENTAL_QUOTE:
          return [
            "Transmitting to Bright Event Rentals...",
            "CC'ing Financial Unit Approver...",
            "Logging outbound communication..."
          ];
        case Phase.EVENT_VALET_QUOTE:
          return [
            "Transmitting to Ace Parking...",
            "CC'ing Financial Unit Approver...",
            "Logging outbound communication..."
          ];
        case Phase.EVENT_CATERING_CHECK:
          return [
            "Creating follow-up task for Guest List...",
            "Syncing with Dashboard Reminders..."
          ];
        case Phase.EVENT_FUNDING_CHECK:
          return [
            "Accessing Oracle Financial Cloud...",
            "Validating Budget Availability..."
          ];
        case Phase.EVENT_POLICY_GUIDANCE:
          return [
            "Drafting Payment Request for Oracle Financial Cloud...",
            "Setting Dashboard Reminders for Guest List...",
            "Establishing Inbox Monitors for Vendor Quotes..."
          ];
        // Removed Phase.EVENT_SPEAKER_FORM entirely
        default:
          return ["Optimizing Workflow...", "Syncing with Oracle ERP"];
      }
    }

    switch (currentPhase) {
      case Phase.IDLE:
        return [
          "Parsing Procurement Intent...",
          "Identifying Purchasing Category (Lab Equipment)...",
          "Cross-referencing Oracle Account Codes...",
          "Flagging Missing Technical Specs..."
        ];
      case Phase.SPEC_CHECK:
        return [
          "Querying CAMS Asset Registry...",
          "Scanning York Hall Shared Equipment Database...",
          "Analyzing Utilization Data...",
          "Calculating Sustainability Parity Score..."
        ];
      case Phase.INVENTORY_CHECK:
        if (userInput.toLowerCase().includes("no") || userInput.toLowerCase().includes("own")) {
          return [
            "Fetching Active Projects from Oracle PPM...",
            "Identifying Eligible Funds (NIH/NSF/GEN)...",
            "Preparing Budget Selection Interface..."
          ];
        }
        return ["Rerouting to Shared Asset Protocol...", "Contacting Resource Custodian"];
      case Phase.FUNDING_CHECK:
        return [
          "Accessing Oracle PPM Funding Module...",
          "Validating Budget Availability...",
          "Checking Project Expiration Dates...",
          "Verifying Allowability for Expenditure Type..."
        ];
      case Phase.COMPARISON:
        return [];
      case Phase.TAX_EXEMPTION_INIT:
        return [
          "Loading California Franchise Tax Board Regulations...",
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
          "Recalculating Total...",
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

  const processAgentResponse = async (userInput: string, phaseOverride?: Phase, workflowOverride?: 'procure' | 'event') => {
    const currentPhase = phaseOverride !== undefined ? phaseOverride : phase;
    const currentWorkflow = workflowOverride || workflowType;

    if (!currentWorkflow) return;

    const steps = getStepsForPhase(currentPhase, userInput, currentWorkflow);
    if (steps.length > 0) {
      await runProcessingSteps(steps, currentPhase);
    }

    let response: Message = {
      id: (Date.now() + 1).toString(),
      role: 'agent',
      content: '',
      timestamp: new Date()
    };

    if (currentWorkflow === 'event') {
      switch (currentPhase) {
        case Phase.IDLE:
          response.content = "The SIO Forum is a fantastic venue for a lunch banquet. I have noted your target date of March 1, 2026, and your headcount of 200. I can certainly help you coordinate the rentals, valet, catering, and speaker compensation. \n\nSince SIO is a specialized facility, I first need to check the guest list composition for policy compliance. **What is the purpose of the event?**";
          response.actions = ["Busienss/Technical Meeting", "Employee Morale Building", "Fundraising/Tickets", "Grand Rounds", "On-the-job Meals", "Public/Community Service", "Student Events"];
          setPhase(Phase.EVENT_VENUE_CHECK);
          break;

        case Phase.EVENT_VENUE_CHECK:
          response.content = "Excellent. Since this is a **Fundraising** event, that effects which UC Entertainment policies apply. I’ll account for that as we move forward. I will filter for Triton-Preferred suppliers for your event.\n\nLet's start with your first requirement: **Party Rentals**. You need a quote from Bright Event Rentals (Agreement Supplier) to generate the requisition. I've drafted the request using your 200-person headcount.";
          response.metadata = {
            type: 'email_draft',
            to: 'quotes@brighteventrentals.com',
            subject: 'Quote Request - UC San Diego SIO Forum Event (3/1/2026)',
            message: `Hi Bright Event Rentals Team, 

I am looking for a quote for a lunch banquet at the **SIO Forum** on **March 1, 2026**. We are hosting **200 guests** and require the following essentials for delivery:

* 200 White Wood Folding Chairs
* 20 60" Round Tables (Seating 10)
* 4 6' Rectangular Tables (for Catering/Registration)
* 200 Sets of Silverware and Glassware

Could you please confirm availability for this date and provide an estimate including delivery and pickup to the La Jolla area?

Thank you,
${projectInfo.user}`
          };
          response.actions = ["Send Email", "Edit Email"];
          setPhase(Phase.EVENT_RENTAL_QUOTE);
          break;

        case Phase.EVENT_RENTAL_QUOTE:
          response.content = "✅ **Rental request sent.** A copy has been forwarded to your inbox and CC'd to your financial unit approver.\n\nMoving to your second requirement: **Valets.** Given the 200-guest count at SIO, Ace Parking is our preferred partner to handle the traffic volume. I've proactively drafted the following request";
          response.metadata = {
            type: 'email_draft',
            to: 'ucsd-events@aceparking.com',
            subject: 'Valet Quote - SIO Forum (3/1/2026)',
            message: `Hi Ace Team,

I need a valet staffing quote for a lunch banquet at the **SIO Forum** on **March 1, 2026**.

* **Guest Count:** 200 people (Approx. 80-120 cars)
* **Estimated Hours:** 11:00 AM – 2:30 PM
* **Type:** Hosted (Complimentary for guests)
* **Parking:** Using the adjacent SIO parking lot 

Please provide an estimate for the necessary number of attendants to ensure a smooth arrival and departure.

Thank you,
${projectInfo.user}`
          };
          response.actions = ["Send Email", "Edit Email"];
          setPhase(Phase.EVENT_VALET_QUOTE);
          break;

        case Phase.EVENT_VALET_QUOTE:
          response.content = "✅ **Valet request sent.**\n\nRequirement three: **Catering.** Per Regents Policy 5402, **all** full-service catering performed on-campus **must be** performed by Saltaire Catering. Since your event is at the Forum at SIO,  I've preselected Saltaire as your catering company. Current meal maximums are $54 per person for lunch.\n\nTo proceed with Saltaire and ensure we stay compliant with donor caps, I need you to upload the preliminary guest list. Do you have that ready?";
          response.actions = ["I don't have it yet", "Upload Guest List"];
          setPhase(Phase.EVENT_CATERING_CHECK);
          break;

        case Phase.EVENT_CATERING_CHECK:
          if (userInput.toLowerCase().includes("don't") || userInput.toLowerCase().includes("yet") || userInput.toLowerCase().includes("not")) {
            response.content = "No problem! I've created a follow-up task on your dashboard to upload the list later so we don't lose momentum.\n\nBefore we move to your final request (the speaker payment), which funding source would you like to use to cover these event expenses?";
            response.actions = ["Use Symposium 1x Funds", "Add New Funding Source"];
            setTaskCount(prev => prev + 1);
            setPhase(Phase.EVENT_FUNDING_CHECK);
          } else {
            response.content = "Excellent. Guest list received and attached to the event profile. \n\nTo continue, which funding source would you like to use for these expenses?";
            response.actions = ["Use Symposium 1x Funds", "Add New Funding Source"];
            setPhase(Phase.EVENT_FUNDING_CHECK);
          }
          break;

        case Phase.EVENT_FUNDING_CHECK:
          response.content = "Budget check passed for the **Symposium 1x Fund.** \n\nNow for your final requirement: **Paying your speaker.** To process this, I will draft a Payment Request against the General Fund. What is the name of the speaker that you are bringing in?";
          setPhase(Phase.EVENT_POLICY_GUIDANCE);
          break;

        case Phase.EVENT_POLICY_GUIDANCE:
          response.content = `Excellent.  I’ve confirmed that **${userInput}** has an active supplier profile in Oracle. I have everything I need to create the payment request for **${userInput}**, and I am submitting it now to your Departmental Approver.\n\nAs a reminder, I've added a task to your dashboard and will nudge you in a few days to upload the finalized guest list for Saltaire Catering. \n\nI am also actively monitoring our inbox. Once Bright Event Rentals and Ace Parking return their quotes, I will automatically retrieve them and finalize those requisitions to secure all your event elements.\n\n**You are all set for now!** I'll handle these next steps in the background. If you have any other questions, just let me know. Otherwise, I look forward to collaborating with you to finalize these details!`;
          // Explicitly removing response.actions to prevent buttons from rendering
          setPhase(Phase.FINISHED);
          break;
        // Removed Phase.EVENT_SPEAKER_FORM entirely

        default:
          response.content = "The event workflow is complete. How else can I assist with your planning today?";
      }
    } else {
      // Procurement Workflow
      switch (currentPhase) {
        case Phase.IDLE:
          response.content = "I can certainly assist with that. To ensure technical parity and correct sourcing for a electron microscope, I'll need a few more technical specifications. Could you please provide the required **Resolution (nm)** and **Operating Voltage (kV)**?";
          setPhase(Phase.SPEC_CHECK);
          break;

        case Phase.SPEC_CHECK:
          response.content = "⚠️ **Attention!** \n\nI scanned your department’s asset inventory and found **2 matching units** currently underutilized in the Biology Department (York Hall Cluster). \n\nWould you like to request access to share these resources instead of purchasing new equipment? If you aren’t going to need this item frequently, sharing equipment helps our **sustainability goal** and **saves** your project budget!";
          response.actions = ["Yes, share resource", "No, I need my own"];
          setPhase(Phase.INVENTORY_CHECK);
          break;

        case Phase.INVENTORY_CHECK:
          if (userInput.toLowerCase().includes("no") || userInput.toLowerCase().includes("own")) {
            response.content = "Understood. To get your purchase started, please identify the project or chart string you want to use. Here’s a list of the projects or chart strings you’ve used in the past you can select from, or you can type a new project or chart string in the box below. Which active project would you like to use?";
            response.actions = ["Charge to 2028517-SP SHAH NIH R01AR081887", "Charge to 2025433-SP Pui NSF CNS-2212241", "Charge to 1015411-OTHR Symposium Fund"];
            setPhase(Phase.FUNDING_CHECK);
          } else {
            response.content = "Excellent choice. Initiating Resource Share request with Dr. Smith's lab in Biology. You've saved **$68,500** in project funds.";
            setPhase(Phase.FINISHED);
          }
          break;

        case Phase.FUNDING_CHECK:
          let selectedProject = "2028517-SP SHAH NIH R01AR081887";
          if (userInput.includes("NSF")) selectedProject = "2025433-SP Pui NSF CNS-2212241";
          if (userInput.includes("GEN")) selectedProject = "1015411-OTHR Symposium Fund";
          
          response.content = `Budget check passed for **${selectedProject}**. Based on this funding source's approved catalogs, I have retrieved the best sourcing options for your specifications:`;
          response.metadata = {
            type: 'comparison',
            options: [
              { label: 'Non-Contracted (User Choice)', price: '$68,500', shipping: '4-6 Weeks', compliance: 'New Vendor Setup Required', risk: 'High' },
              { label: 'Triton Recommended (ThermoFisher)', price: '$58,500', shipping: '1 Week', compliance: 'Pre-negotiated Warranty', risk: 'Low' }
            ]
          };
          response.actions = ["Select Triton Recommended", "Proceed with Non-Contracted"];
          setPhase(Phase.COMPARISON);
          break;

        case Phase.COMPARISON:
          response.content = "I see you've selected the ThermoFisher equipment ($58,500). Based on your department’s registration (Life Sciences R&D), this item may qualify for the California Partial Sales Tax Exemption, which would save you approximately $2,303 on this transaction.\n\nWould you like me to verify eligibility and generate the exemption certificate for the vendor?";
          response.actions = ["Yes, let's do that", "No, skip exemption"];
          setPhase(Phase.TAX_EXEMPTION_INIT);
          break;

        case Phase.TAX_EXEMPTION_INIT:
          response.content = "Great. To ensure high-compliance and minimize audit risk, I just need to confirm three things:\n\n1. **Useful Life:** Will this equipment be used in your lab for at least one year?\n2. **Usage:** Will it be used 50% or more of the time for R&D activities here in California?\n3. **Exclusion Check:** Will this item be used strictly for research purposes?";
          setPhase(Phase.TAX_EXEMPTION_Q1);
          break;

        case Phase.TAX_EXEMPTION_Q1:
          response.content = "Perfect. One final compliance check: Does this purchase support an activity where you are discovering information that is technological in nature for a new or improved business component?";
          setPhase(Phase.TAX_EXEMPTION_Q2);
          break;

        case Phase.TAX_EXEMPTION_Q2:
          response.content = "Eligibility confirmed.\n\n• **Compliance Status:** High (Meets Reg. 1525.4 criteria).\n\n• **Tax Impact:** Applied 3.9375% reduction to the state portion.\n\n• **Action:** I have generated the CDTFA-230-M certificate and attached it to your Requisition Order. The vendor will receive this automatically.\n\nYour estimated total has been updated from $58,500 to $56,197. \n\n **Ready to submit?**";
          setPhase(Phase.COMPLIANCE);
          break;

        case Phase.COMPLIANCE:
          response.content = "Excellent. I am auto-generating the required compliance documentation and routing this through **Oracle Financial Cloud**.";
          response.metadata = {
            type: 'compliance_checklist',
            items: [
              { text: "Price > $5,000 → Flagged as Inventorial Equipment, Expenditure Type updated", status: 'done' },
              { text: "Federally Funded Order > $10K: UC Required. SSPR Generated: Price reasonableness validated against past purchases made by Chemistry Department", status: 'done' }
            ]
          };
          
          setTimeout(() => {
            const poMsg: Message = {
              id: 'po-final',
              role: 'agent',
              content: "✅ **Requisition successfully submitted to Oracle Cloud.** \n\n**Requisition #REQ0218927** has been created. The supplier will be issued a Purchase Order (PO). Tracking information will be updated in your dashboard shortly.",
              timestamp: new Date()
            };
            setMessages(prev => [...prev, poMsg]);
          }, 4000);
          setPhase(Phase.FINISHED);
          break;
        
        default:
          response.content = "Process complete. How else can I assist with your procurement needs  today?";
      }
    }

    setMessages(prev => [...prev, response]);
  };

  const handleStartQuery = (initialMessage: string) => {
    const intent = /event|plan|symposium|organize|retreat/i.test(initialMessage) ? 'event' : 'procure';
    setWorkflowType(intent);
    setActiveTab('chat');
    setPhase(Phase.IDLE);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: initialMessage,
      timestamp: new Date()
    };
    setMessages([userMsg]);

    // Trigger agent response immediately with intent override
    processAgentResponse(initialMessage, Phase.IDLE, intent);
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    
    await processAgentResponse(text);
  };

  const getActiveSessionName = () => {
    if (workflowType === 'procure') return "Procurement Assistant";
    if (workflowType === 'event') return "Event Coordinator";
    return null;
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900">
      <Sidebar projectInfo={projectInfo} activeTab={activeTab} setActiveTab={setActiveTab} taskCount={taskCount} />

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
          <Dashboard onStartQuery={handleStartQuery} />
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
