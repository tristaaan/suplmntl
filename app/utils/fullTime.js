function leftPad(val) {
  if (val.length < 2) {
    return `0${val}`;
  }
  return val;
}

export default function dateFmt(mDate) {
  const hours = leftPad(mDate.getHours().toString());
  const minutes = leftPad(mDate.getMinutes().toString());
  return `${mDate.getFullYear()}/${mDate.getMonth()}/${mDate.getDay()} at ${hours}:${minutes}`;
}
