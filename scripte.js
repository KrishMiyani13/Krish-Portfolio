document.addEventListener('DOMContentLoaded', () => {
    // --- KEY ELEMENTS AND FLAGS ---
    const VISITED_FLAG = 'hasCompletedSetup'; 
    const PROFILE_ROLE_KEY = 'userRole';
    const MANUAL_SWITCH_KEY = 'manualSwitch'; 
    
    const body = document.body;
    const welcomeModal = document.getElementById('welcome-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const profileSelector = document.getElementById('profile-selector');
    const switchProfileLink = document.getElementById('switch-profile-link');
    const personalizationTarget = document.getElementById('personalization-target');
    
    // --- PERSONALIZATION DATA ---
    const personalizationContent = {
        'HR': {
            text: `
                <span class="bold-text">A Bit About Me (For Recruiters)</span><br>
                My core competency lies in leveraging Data Science principles and robust programming (Java, Python) to drive measurable results. I specialize in building solutions—like a Hospital Management System—that demonstrate strong project lifecycle management and technical discipline. My goal is to transition into a full-time data professional role.
            `
        },
        'Manager': {
            text: `
                <span class="bold-text">A Bit About Me (For Hiring Managers)</span><br>
                I am a focused 3rd-semester engineering student specializing in Java and DBMS, with a passion for problem-solving. My work, including the GreenSaarthi app and enterprise-level system design, showcases my ability to execute complex projects and quickly adapt new technologies. I seek opportunities to apply my analytical and development skills.
            `
        },
        'Developer': {
            text: `
                <span class="bold-text">A Bit About Me (For Peers)</span><br>
                Let's talk tech! My primary languages are Java and Python, and I'm deeply into high-performance Data Structures and efficient database management (DBMS). Check out my projects, like the Hospital Management System, for a detailed look at my code structure and architectural choices. Always open to collaborating on challenging problems.
            `
        }
    };
    
    // --- INITIALIZATION AND SEQUENCING LOGIC ---

    const hasCompletedSetup = sessionStorage.getItem(VISITED_FLAG);
    const currentRole = sessionStorage.getItem(PROFILE_ROLE_KEY);
    const isManualSwitch = sessionStorage.getItem(MANUAL_SWITCH_KEY);
    
    if (hasCompletedSetup) {
        // SCENARIO 1: Setup Complete -> Show Main Content
        
        // Hide all selector elements
        welcomeModal.classList.add('hidden-screen');
        profileSelector.classList.add('hidden-screen');
        body.classList.remove('content-hidden'); // This is now redundant but kept for safety
        body.removeAttribute('id'); // Remove background image/style ID
        
        // Apply personalization based on the stored role
        const content = personalizationContent[currentRole] || personalizationContent['Developer'];
        personalizationTarget.innerHTML = content.text;

    } else {
        // SCENARIO 2/3: First time or manual switch -> SHOW WELCOME/SELECTOR
        
        // Hide main content
        body.classList.add('content-hidden');

        if (isManualSwitch) {
            // SCENARIO 2: Manual Switch -> Skip Welcome, Go to Selector
            welcomeModal.classList.add('hidden-screen');
            profileSelector.classList.remove('hidden-screen');
            
            sessionStorage.removeItem(MANUAL_SWITCH_KEY); // Clear the flag
        } else {
            // SCENARIO 3: True First Visit -> Show Welcome Modal
            welcomeModal.classList.remove('hidden-screen');
            profileSelector.classList.add('hidden-screen');
            
            // Attach click listener to the Welcome Modal button
            closeModalBtn.addEventListener('click', transitionToProfileSelector);
        }
    }
    
    // --- EVENT HANDLERS ---
    
    // Function to transition from Welcome Modal to Profile Selector
    function transitionToProfileSelector() {
        welcomeModal.style.opacity = 0;
        
        setTimeout(() => {
            welcomeModal.classList.add('hidden-screen');
            profileSelector.classList.remove('hidden-screen');
        }, 300);
    }

    // Function to handle profile selection (Goes to Main Page)
    function selectProfile(role) {
        // 1. Store the selected role and the setup completion flag
        sessionStorage.setItem(PROFILE_ROLE_KEY, role);
        sessionStorage.setItem(VISITED_FLAG, 'true'); 
        
        // 2. Hide all selector elements and show main content immediately
        welcomeModal.classList.add('hidden-screen');
        profileSelector.classList.add('hidden-screen');
        body.classList.remove('content-hidden');
        body.removeAttribute('id'); // Remove background image/style ID

        // 3. Re-run personalization logic to instantly update content
        const content = personalizationContent[role] || personalizationContent['Developer'];
        personalizationTarget.innerHTML = content.text;
    }

    // Attach profile selection handlers
    document.querySelectorAll('.profile-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            selectProfile(link.getAttribute('data-role'));
        });
    });
    
    // Attach direct contact handler
    document.getElementById('manage-profiles-btn').addEventListener('click', () => {
        selectProfile('HR'); 
    });

    // --- Switch Profile Handler ---
    if (switchProfileLink) {
        switchProfileLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Clear flags and set manual switch flag
            sessionStorage.removeItem(VISITED_FLAG); 
            sessionStorage.removeItem(PROFILE_ROLE_KEY);
            sessionStorage.setItem(MANUAL_SWITCH_KEY, 'true'); 
            
            // Re-load the page to trigger the 'manualSwitch' logic
            window.location.reload(); 
        });
    }

    // --- Navigation Links Logic ---
    const pageUrls = {
        resume: 'resume.html',
        projects: 'projects.html',
        contact: 'contact.html'
    };

    const updateLinkHref = (id, href) => {
        const link = document.getElementById(id);
        if (link) link.href = href;
    };

    updateLinkHref('top-resume-link', pageUrls.resume);
    updateLinkHref('top-projects-link', pageUrls.projects);
    updateLinkHref('top-contact-link', pageUrls.contact);

    updateLinkHref('circle-resume', pageUrls.resume);
    updateLinkHref('circle-projects', pageUrls.projects);
    updateLinkHref('circle-contact', pageUrls.contact);
});