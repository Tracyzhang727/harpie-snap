import { OnTransactionHandler } from '@metamask/snaps-types';
import { heading, panel, text } from '@metamask/snaps-ui';

// Handle outgoing transactions.
export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  const address = transaction.to;  
  const response = await fetch("https://api.harpie.io/v2/validateAddress", {
    method: "POST",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        apiKey: "541e2fce-c0a1-495e-8989-ac4dc224d5fd",
        address: address
    })
  })
  const data = await response.json();

  const headingText = data.isMaliciousAddress ? 'Malicious!' : 'Safe, verified by Harpie.';
  const details = data.isMaliciousAddress ? data.summary : 'This address is safe.';
  const tags = Object.entries(data.tags).map(([key, value]) => {
    const formattedKey = key.toLowerCase().replace(/_/g, ' ');
    return text(`${formattedKey}: ${value ? 'True' : 'False'}`);
  });
  
  return {
    content: panel([
      heading(headingText),
      text(
        `${details}`,
      ),
      ...tags
    ]),
  };
};