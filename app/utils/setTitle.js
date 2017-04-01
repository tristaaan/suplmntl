export default function setTitle(str, raw = false) {
  if (raw) {
    document.title = `${str}`;
  } else {
    document.title = `Suplmntl - ${str}`;
  }
}

export function resetTitle() {
  if (document.title !== 'Suplmntl') {
    document.title = 'Suplmntl';
  }
}
