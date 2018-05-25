window.onload = function () {
    var socket = io.connect('http://localhost:3000');
    var $head = $('.head');
    var $talkingHead = null;
    var users = [];
    var time = 0;
    var sleepTime = 0;

    socket.on('users', function (data) {
        users = data;
        updateTalkingFaces();
    });

    socket.on('botId', function (data) {
        botId = data;
    });

    socket.on('sleepTime', function (data) {
        sleepTime = data;
    }); 

    socket.on('time', function (data) {
        time = data;
    });

    var updateTalkingFaces = function () {
        $(document).find('.users').empty();

        for (var id in users) {
            if (!users[id].isBot) {
                $talkingHead = $head.clone().show().css('display', 'inline-block');

                var customCharacter = window.BJ.custom[users[id].username] || {};
                var topImg = customCharacter.image_top || 'img/t_top.png';
                var topImgSleeping = customCharacter.image_sleeping || 'img/t_top_sleeping.png';
                var bottomImg = customCharacter.image_bottom || 'img/t_bot.png';
                var shakeStyle = 'shake-constant ' + (customCharacter.shake_style || 'shake-chunk');
                var nickname = customCharacter.nick || users[id].username;
                var animationType = customCharacter.animation_type || "shake";

                $(document).find('.users').append($talkingHead);
                if (animationType === "shake") {
                    $talkingHead.find('.top img').attr('src', topImg);
                    $talkingHead.find('.bot img').attr('src', bottomImg);
                    $talkingHead.find('.name').append(nickname);

                    if (users[id].speaking) {
                        $talkingHead.find('.top img').attr('src', topImg);
                        $talkingHead.find('.top').addClass(shakeStyle);
                    } else {
                        $talkingHead.find('.top').removeClass(shakeStyle);
                        if (!users[id].timeSinceLastSpoke || time - users[id].timeSinceLastSpoke >= sleepTime) {
                            $talkingHead.find('.top img').attr('src', topImgSleeping);
                        }
                    }
                }

                if (animationType === "gif") {
                    $talkingHead.find('.top img').addClass('gif');
                    $talkingHead.find('.bot').remove();
                    $talkingHead.find('.name').append(nickname);

                    if (users[id].speaking) {
                        $talkingHead.find('.top img').attr('src', customCharacter.talking);
                    } else {
                        $talkingHead.find('.top img').attr('src', customCharacter.idle);
                        if (!users[id].timeSinceLastSpoke || time - users[id].timeSinceLastSpoke >= sleepTime) {
                            $talkingHead.find('.top img').attr('src', customCharacter.sleeping);
                        }
                    }
                }
            }
        }
    };

    updateTalkingFaces();
};