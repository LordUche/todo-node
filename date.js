function getDate() {
  const today = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  const day = today.toLocaleDateString('en-GB', options);
  return day;
}

function getDay() {
  const today = new Date();
  const options = { weekday: 'long' };
  const day = today.toLocaleDateString('en-GB', options);
  return day;
}

module.exports = {getDate, getDay};
