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

## Assistente de Emails Helpdesk (Extensão Chrome)

Esta extensão para Chrome ajuda a gerar e preparar e-mails padronizados para o time de suporte (helpdesk). Ela permite escolher templates, adicionar observações e copiar o assunto e corpo gerados para a área de transferência.

### Funcionalidades

- Templates pré-definidos (ex.: desbloqueio de conta, extensão de acesso).
- Substituição de placeholders por valores informados (usuário, ticket, e-mail).
- Geração de assunto e corpo usando um modelo de linguagem.
- Copiar separadamente o assunto ou o corpo para a área de transferência.
- Gerenciar templates (adicionar/editar/excluir) via popup.
- Abrir a interface em uma janela separada (estilo sidebar) para uso contínuo.

### Instalação (Modo Desenvolvedor)

1. Abra o Chrome e navegue para `chrome://extensions`.
2. Ative o `Developer mode` no canto superior direito.
3. Clique em `Load unpacked` e selecione a pasta desta extensão (a pasta raiz onde estão `manifest.json`, `popup.html`, etc.).
4. A extensão aparecerá na lista; você pode fixá-la na barra de ferramentas.

### Uso

1. Abra a página do sistema de helpdesk onde você normalmente envia solicitações.
2. Clique no ícone da extensão para abrir o popup.
3. Preencha os campos opcionais: `Tema`, `Número do ticket`, `Usuário`, `E-mail do usuário` e `Observações`.
4. Se desejar, selecione um `Template` para orientar o formato do e-mail.
5. Clique em `Generate Email` para gerar o assunto e o corpo.
6. Use `Copy Subject` e `Copy Body` para copiar cada parte separadamente e colar nos campos correspondentes do sistema.

### Gerenciar Templates

- `Add`: cria um template personalizado salvo no armazenamento local do navegador.
- `Edit`: edita um template personalizado ou clona um template padrão para edição.
- `Delete`: remove templates personalizados.

Os templates padrão estão em `templates.json`. Templates personalizados são salvos em `chrome.storage.local`.

### Observações e Resolução de Problemas

- Se o assunto aparecer dentro do corpo gerado, revise o texto gerado no popup e use `Copy Subject` e `Copy Body` para colar manualmente nos campos corretos do seu sistema.
- Se precisar adaptar a extensão para o layout do seu sistema (ex.: seletores específicos de campos), abra `popup.js` e ajuste os seletores usados para localizar os campos do formulário.
- O arquivo `templates.json` contém exemplos; edite ou adicione novos templates conforme necessário.

### Contribuições

Contribuições são bem-vindas — abra issues ou envie pull requests no repositório.

### Licença

Escolha e adicione uma licença apropriada (ex.: MIT) no arquivo `LICENSE` caso deseje publicar com uma licença específica.
