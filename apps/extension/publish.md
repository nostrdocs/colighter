# Publishing Colighter

## Steps:

- clean build dir `yarn clean`
- create new production build `yarn build`
- copy latest manifest to build dir
- zip build dir
- upload to https://chrome.google.com/webstore/devconsole


- version 0.0.1
- okjodom

## Product Details

- Title: from-package
- Summary: from-package
- Description:

Introducing Colighter, the ultimate browser extension app designed to enhance your web browsing experience on Nostr! With Colighter, you can effortlessly highlight and share text snippets, revolutionizing the way you interact with content online. Here's what sets Colighter apart:

1. Effortless Highlighting: With a simple right-click or a convenient keyboard shortcut, you can highlight text on any website with ease. No more struggling with cumbersome tools or complicated procedures.

2. Seamless Integration with Nostr: Colighter seamlessly integrates with Nostr, a powerful platform for sharing and discovering content. By publishing your highlights directly to Nostr, you can effortlessly showcase your insights, thoughts, and discoveries to a wider audience.

3. Unparalleled Convenience: Colighter provides the easiest way to view and create highlighted text on any webpage. Select the desired text and right-click to access the "Colighter" option, or use the default keyboard shortcut 'Alt+H' (or '^H' on Mac) for quick and intuitive highlighting.

4. Preserve Your Highlights: Never lose your valuable highlights again! Colighter automatically saves all your highlighted texts, ensuring that your annotations are retained even when you exit a page. Simply reopen the page, and all your highlights will be restored, enabling you to effortlessly pick up where you left off.

5. Expandable Support: While Colighter currently supports most websites, including static webpages, it is important to note that dynamic webpages like Facebook, Twitter, and popular email clients may have limited functionality. However, rest assured that our dedicated team is continuously working to enhance Colighter's compatibility, and future updates may include full support for these platforms.

Key Features of Colighter:

➪ Create and Publish Highlights to Nostr: Share your insights and ideas with the world by effortlessly creating and publishing highlights directly to Nostr. Amplify your thoughts and engage with a vibrant community of content enthusiasts.

➪ Comprehensive Highlight Management: Easily view and manage all your highlights on a webpage, providing you with a comprehensive overview of your annotations. Navigate through your highlights effortlessly, allowing for efficient review and exploration.

Experience the power of Colighter as it transforms the way you interact with content, enabling you to discover, highlight, and share with unparalleled ease. Elevate your browsing experience with Colighter and unlock a new dimension of engagement on Nostr!

- Category
  - Productivity
- Language
  - English

## Privacy Practices

- Single Purpose
  - Create, view and interact with Highlights distributed over Nostr network

Justifications
- contextMenus
  - Colighter enables two context menu buttons, allowing a user to right click and create or remove a highlight

- scripting
  - Colighter content script loads and renders a user's highlights  from Nostr storage network. It also listens to a users intent to create or delete a highlight and executes the necessary logic 

- storage
  - Colighter safely stores the Users profile and settings in browser storage. It also persists loaded highlights in local storage

- tabs
  - Colighter needs tab events to trigger loading of relevant highlights. The content script is injected on active tabs where a user want's to interact with highlights

- activeTab
  - Colighter needs tab events to trigger loading of relevant highlights. The content script is injected on active tabs where a user want's to interact with highlights

- host permissions
  - Current version of colighter works on any web page visited by the user

Using Remote Code: No

## Data Usage

- Website Content : Text
