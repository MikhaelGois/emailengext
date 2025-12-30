# Helpdesk Email Assistant Chrome Extension

This Chrome extension helps automate the process of writing standardized helpdesk emails by automatically filling in the subject and body of the message on a webpage.

## Features

-   **Standardized Templates**: Pre-defined email templates for common helpdesk requests (e.g., account unlock, account expiration extension).
-   **Dynamic Placeholders**: Automatically replaces placeholders like `[User ID]` and `[Date]` (for expiration extensions) with user-provided input.
-   **Automatic Field Filling**: Injects the generated subject and body into appropriate input fields on the active webpage.

## Installation

1.  **Download/Clone the Repository**:
    If you received this as a zip file, extract it to a folder.
    If you're cloning, navigate to your desired directory and run:
    ```bash
    git clone [repository-url]
    ```
    (Note: As this was built directly by the agent, you will have the files directly in your working directory.)

2.  **Open Chrome Extensions Page**:
    Open Google Chrome and navigate to `chrome://extensions`.

3.  **Enable Developer Mode**:
    Toggle on "Developer mode" in the top-right corner of the extensions page.

4.  **Load Unpacked**:
    Click the "Load unpacked" button.

5.  **Select Extension Folder**:
    Browse to the directory where you saved/extracted the extension files (e.g., `c:\Users\MBalieroDG\OneDrive - Luxottica Group S.p.A\Área de Trabalho\english mail extensão`). Select this folder and click "Select Folder".

6.  **Pin the Extension (Optional but Recommended)**:
    After loading, you should see the "Helpdesk Email Assistant" extension listed. Click the puzzle piece icon next to your profile avatar in the Chrome toolbar, and then click the pin icon next to "Helpdesk Email Assistant" to make its icon visible in the toolbar.

## Usage

1.  **Navigate to Helpdesk Page**:
    Go to the webpage where you typically write helpdesk emails (e.g., your internal ticketing system).

2.  **Click the Extension Icon**:
    Click on the "Helpdesk Email Assistant" icon in your Chrome toolbar. A small popup window will appear.

3.  **Enter User ID**:
    In the popup, enter the relevant User ID into the "User ID" input field.

4.  **Select Email Template**:
    Click on one of the template buttons (e.g., "Unlock Account", "Extend Account Expiration").
    -   If you select "Extend Account Expiration", a prompt will ask you to enter a new expiration date. A default date (one year from today) will be suggested.

5.  **Email Fields Populated**:
    The extension will attempt to find and fill the subject and body fields on your current webpage with the generated email content. A confirmation message will appear in the browser's console (F12 > Console) indicating success or failure.

6.  **Review and Send**:
    Review the pre-filled email on the webpage, make any necessary adjustments, and then send it.

## Troubleshooting

-   **Fields Not Filling**:
    The extension tries to intelligently find common subject and body input fields. If your helpdesk system uses unusual field names or structures, the extension might not be able to find them. In `popup.js`, the `fillEmailFields` function contains the logic for identifying fields. You might need to inspect the HTML of your helpdesk page and modify the selectors in `popup.js` to match your specific system's input fields (e.g., `input[name="ticket_subject"]`, `textarea[id="ticket_description"]`).
-   **"Error loading templates"**:
    Ensure `templates.json` is in the same directory as `manifest.json`.
-   **Extension Not Appearing**:
    Double-check that developer mode is enabled and you've selected the correct folder when clicking "Load unpacked".
