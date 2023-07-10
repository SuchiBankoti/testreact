const obj = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};
function ro(str) {
  const arr = str.split("");
  let value = 0;
  for (let i = 0; i < arr.length; i++) {
    obj[arr[i]] < obj[arr[i + 1]]
      ? (value -= obj[arr[i]])
      : (value += obj[arr[i]]);
  }
  console.log(value);
}
ro("MCMXCIV");
