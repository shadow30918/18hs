window.onload = function(){
    $('.loading').fadeOut(500,function(){
        GEvent('進入網站','進入網站');
        $('.loading').remove();
        
        $('.kids img').addClass('act');
        $('.bridge img').addClass('act');
        setTimeout(function() {
            $('.star img').addClass('bounceIn');
        }, 300);
        setTimeout(function() {
            $('.dia img').addClass('bounceIn');
        }, 700);
        setTimeout(function() {
            $('.kv .title img').addClass('tada');
            $('.kv ul li').addClass('act');
        }, 1000);
    });
}

var winner_top;

$(document).ready(function(){

    $(document).scroll(function(){
        scroll_top = $(document).scrollTop();
        if(scroll_top > 100){
            $('header').addClass('scroll');
        }else{
            $('header').removeClass('scroll');
        }
    })

    $('.ham,.menu .close').click(function(){
        menu();
    });

    $('.fb').click(function(){
        shareFb();
    });

    $('.line').click(function(){
        shareLine();
    });

    $('.menu .list li, .kv ul li').click(function(){
        data = $(this).attr('data');
        if(data=='rule'){
            menu();
            GEvent('menu','menu_活動辦法');
            $('body,html').animate({
                scrollTop: $('.rule').offset().top -100
            },500,'swing');
        }else if(data == 'lottery'){
            menu();
            GEvent('menu','menu_參加抽獎');
            $('body,html').animate({
                scrollTop: $('.form').offset().top -100
            },500,'swing');
        }else if(data == 'lottery_kv'){
            GEvent('menu','menu_參加抽獎');
            $('body,html').animate({
                scrollTop: $('.form').offset().top -100
            },500,'swing');
        }else if(data == 'winner'){
            GEvent('menu','menu_得獎名單');
            menu();
            winner_top = $(window).scrollTop();
            $('.wrap').css('top',-winner_top);
            $('.wrap').toggleClass('fixed');
            $(window).scrollTop(0);
            $('.pop').fadeIn(0);
        }else if(data == 'buy'){
            GEvent('menu','menu_我要購票');
            window.open('https://www.mandarin-airlines.com/','_blank');
        }
    });

    $('.pop .close').click(function(){
        $('.pop').fadeOut(500);
        $('.wrap').css('top',0);
        $('.wrap').toggleClass('fixed');
        $(window).scrollTop(winner_top);
        
    });

    var dataInfo = {'u_name':'','u_mobile':'','u_zip':'','u_addr':'','u_ticket':''};
    $('#Bu_Submit').on('click', function() {
        dataInfo.u_name=$('#u_name').val();
        dataInfo.u_mobile=$('#u_mobile').val();
        dataInfo.u_zip=$('#u_zip').val();
        dataInfo.u_addr=$('#u_addr').val();
        dataInfo.u_ticket= '803'+ $('#u_ticket').val();

        checkdata(dataInfo.u_name, dataInfo.u_mobile, dataInfo.u_zip, dataInfo.u_addr, dataInfo.u_ticket)
    });
      
    function checkdata(name, phone, zip, addr ,ticket) {
        var mailfrom = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var phonefrom = /09[0-9]{8}/;
        var ticketform = /[0-9]{13}/;
        var zipform = /[0-9]{3,5}/;
    
        if (name === "") {
            alert("請輸入名字");
            return false;
        } else if (!phonefrom.test(phone)) {
            alert("手機格式有誤");
            return false;
        } else if(!zipform.test(zip)){
            alert("郵遞區號格式有誤");
            return false;
        } else if(addr === ""){
            alert("請輸入住址");
            return false;
        } else if (!ticketform.test(ticket)) {
            alert("機票格式有誤");
            return false;
        } else if ($('#attn')[0].checked !== true) {
            alert("請勾選同意送出個人資料");
            return false;
    
        } else {
            var $request = $.ajax({
                url: "func.php",
                type: "POST",
                data: {
                    func: 'submit',
                    data: dataInfo
                },
                timeout: 30 * 1000, //waiting timeout 30sec
                dataType: "json"
            }).done(function (data) {
                switch (toNumber(data.ok)) {
                    case 1:
                        GEvent('表單','成功送出表單');
                        alert('成功送出')
                        $('input').val('');
                        break;
                    case 0:
                        alert('機票號碼已登記過');
                        break;
                    case -1:
                        alert("有欄位格式有問題 ==> " + data.fields)
                        break;
                    case -2:
                        alert("有欄位沒填資料 ==> " + data.fields)
                        break;
                    case -3:
                        alert("目前不在活動期間");
                        $('input').val('');
                        break;
                }
            });
        }
    }

    $('.pop ul li').click(function(e){
        winner(e);
    })

    
});

function menu() {
    $('.menu').toggleClass('open');

    if($('.menu').hasClass('open')){
        $('.menu').fadeIn(500);
        setTimeout(function(){
            $('.list').toggleClass('open');
        },100)
    }else{
        $('.menu').fadeOut(300);
        $('.list').toggleClass('open');
    }
}

function toNumber(strNumber) {
    return +strNumber;
}


/*function shareTwitter(){
    var myUrl = 'http://twitter.com/share?url=' + encodeURIComponent(location.href) + '&text=' + encodeURIComponent('想念');
    window.open(myUrl, 'twitter_tweet', 'width=550, height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1');
}*/

function shareFb() {
    var myUrl = 'http://www.facebook.com/share.php?u=' + encodeURIComponent(location.href);
    window.open(myUrl, 'window', 'width=550, height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1');
    return false;
}

function shareLine() {
    var myUrl = 'https://lineit.line.me/share/ui?url=' + encodeURIComponent(location.href);
    /*if ( $(window).width() < 768 ){
      myUrl = "line://msg/text/"+ encodeURIComponent('想念\n') + encodeURIComponent(location.href);
    }*/
    window.open(myUrl, 'window', 'width=550, height=550,personalbar=0,toolbar=0,scrollbars=1,resizable=1');
    return false;
}

function winner(e) {
    winner_index = $(e.currentTarget).index()+1;
    console.log(winner_index);
    
    $('.winner').hide();
    $('.winner:nth-child('+winner_index+')').show();
}