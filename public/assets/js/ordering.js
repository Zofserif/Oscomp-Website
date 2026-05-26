window.onload = () => {
  console.log(selector);

  

  const changeEntry = (e) => {
    var selector = "12";
    localStorage.setItem("selectvalue", selector);
    console.log(selector);
      // const $select = document.querySelector('#mySelect');
      // $select.value = "12"
  };

  
  
  const changeIdeal = (e) => {
    var selector = "13";
    localStorage.setItem("selectvalue", selector);
    console.log(selector);
    // const $select = document.querySelector('#mySelect');
    // $select.value = 'steve'
  };
  
  
  const changeFull = (e) => {
    var selector = "14";
    localStorage.setItem("selectvalue", selector);
    console.log(selector);
    // const $select = document.querySelector('#mySelect');
    // $select.value = 'steve'
  };

  const changeCustomize = (e) => {
    var selector = "15";
    localStorage.setItem("selectvalue", selector);
    console.log(selector);
    // const $select = document.querySelector('#mySelect');
    // $select.value = 'steve'
  };
  
  var selector = "0";
  
  document.querySelector('.changeEntry').addEventListener('click', changeEntry);
  document.querySelector('.changeIdeal').addEventListener('click', changeIdeal);
  document.querySelector('.changeFull').addEventListener('click', changeFull);
  document.querySelector('.changeCustomize').addEventListener('click', changeCustomize);


}