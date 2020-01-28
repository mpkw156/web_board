$(function(){
    function get2digits (num){
      return ('0' + num).slice(-2);
    }
  
    function getDate(dateObj){
      if(dateObj instanceof Date)
        return dateObj.getFullYear() + '-' + get2digits(dateObj.getMonth()+1)+ '-' + get2digits(dateObj.getDate());
    }
  
    function getTime(dateObj){
      if(dateObj instanceof Date)
        return get2digits(dateObj.getHours()) + ':' + get2digits(dateObj.getMinutes())+ ':' + get2digits(dateObj.getSeconds());
    }
  
    function convertDate(){// html element중에 data-data이 있는 것을 찾는다.
      $('[data-date]').each(function(index,element){
        var dateString = $(element).data('date');
        if(dateString){
          var date = new Date(dateString);
          $(element).html(getDate(date));
        }
      });
    //date-date: 날짜 데이터가 들어 있다면 해당 데이터를 년-월-일의 형태로 변환해서 element의 텍스트 데이터로 넣는다.
    }
  
    function convertDateTime(){
      $('[data-date-time]').each(function(index,element){
        var dateString = $(element).data('date-time');
        if(dateString){
          var date = new Date(dateString);
          $(element).html(getDate(date)+' '+getTime(date));
        }
      });
      //date-date-time: 년-월-일 시:분:초를 텍스트 데이터로 변환.
    }
  
    convertDate();
    convertDateTime();
});
//이 과정을 하는 이유: 날짜/시간을 원하는 형태로 만들기 위해서이다.
//만약, 클라이언트가 해외에 있을 경우 해당 지역의 시간대로 변경되는 문제가 있어서 이것을 변환하기 위해서이다.

//public/js/script.js파일은 node.js 서버에서 사용하는 코드가 아니고, client의 브라우저에서 사용하게 될 JavaScript이다.
//그래서 public폴더에 들어 있으며, head.ejs파일에 이 파일을 불러오는 코드가 작성된다.
