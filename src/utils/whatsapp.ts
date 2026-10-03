import { CartItem, Product } from '../types';

/**
 * Normalizes phone number to international WhatsApp format (without spaces, dashes, or +)
 */
export function formatWhatsAppNumber(phone: string): string {
  const digitsOnly = phone.replace(/[^0-9]/g, '');
  // Default to India country code 91 if 10 digits provided
  if (digitsOnly.length === 10) {
    return `91${digitsOnly}`;
  }
  return digitsOnly;
}

/**
 * Generates WhatsApp URL for single product "Chat to Buy"
 * Exact prompt requirement: “Hi ReShelf, is [product name] available for ₹[price]?”
 */
export function generateSingleProductWhatsAppUrl(
  phone: string,
  product: Product
): string {
  const cleanNumber = formatWhatsAppNumber(phone);
  const message = `Hi ReShelf, is ${product.name} available for ₹${product.price}?`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates WhatsApp URL for cart checkout with all selected products, quantities, and totals
 */
export function generateCartWhatsAppUrl(
  phone: string,
  items: CartItem[],
  totalAmount: number,
  customerLocality?: string,
  customerNotes?: string
): string {
  const cleanNumber = formatWhatsAppNumber(phone);

  const lines: string[] = [
    `Hi ReShelf! I would like to order the following items from the store:\n`,
  ];

  items.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.product.name}` +
        `\n   • Qty: ${item.quantity}` +
        `\n   • Unit Price: ₹${item.product.price}` +
        `\n   • Subtotal: ₹${item.quantity * item.product.price}`
    );
  });

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  lines.push(`\n━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`📦 Total Items: ${totalQuantity}`);
  lines.push(`💰 Total Amount: ₹${totalAmount}`);

  if (customerLocality && customerLocality.trim()) {
    lines.push(`📍 My Hyderabad Locality: ${customerLocality.trim()}`);
  }

  if (customerNotes && customerNotes.trim()) {
    lines.push(`📝 Special Note: ${customerNotes.trim()}`);
  }

  lines.push(`━━━━━━━━━━━━━━━━━━━━━━\n`);
  lines.push(
    `Please confirm the stock availability and your UPI QR code for payment. Thank you!`
  );

  const fullMessage = lines.join('\n');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(fullMessage)}`;
}
