
console.log("Email Writer");

function getEmailContent() {
    const selectors = [
        '.h7', // Subject
        '.a3s.aiL', // Email body
        '.gmail_quote',
        '[role="presentation"]'
    ];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        }
    }
    return '';
}

function findComposeToolbar() {
    const selectors = [
        '.btC', // Gmail compose bottom toolbar
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
    }
    return null;
}

function createAIButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3 ai-reply-button';
    button.style.marginRight = '8px';
    button.innerHTML = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    return button;
}

function injectButton() {
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) {
        existingButton.remove();
    }
    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("Toolbar Not Found");
        return;
    }
    console.log("Toolbar Found");
    const button = createAIButton();

    button.addEventListener('click', async () => {
        try {
            button.innerHTML = 'Generating...';
            button.style.pointerEvents = 'none';

            const emailContent = getEmailContent();

            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: "professional"
                })
            });
            if (!response.ok) {
                throw new Error("API Request Failed");
            }
            const generatedReply = await response.text();

            const composeBox = document.querySelector('div[aria-label="Message Body"]');
            if (composeBox) {
                composeBox.focus();
                composeBox.innerText = generatedReply; // ✅ Instead of execCommand
            }
        } catch (error) {
            console.error(error);
        } finally {
            button.innerHTML = 'AI Reply';
            button.style.pointerEvents = 'auto';
        }
    });

    toolbar.insertBefore(button, toolbar.firstChild);
}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh,.btC,[role="dialog"]') ||
                node.querySelector('.aDh,.btC,[role="dialog"]'))
        );

        if (hasComposeElements) {
            console.log("Compose Window Detected");
            setTimeout(injectButton, 1500); // ✅ Increased delay
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
