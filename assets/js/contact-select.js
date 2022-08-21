window.onload = () => {

const $select = document.querySelector('#mySelect');
$select.value = localStorage.getItem("selectvalue");

var selector = "";
localStorage.setItem("selectvalue", selector);
removeItem("selectvalue");

}