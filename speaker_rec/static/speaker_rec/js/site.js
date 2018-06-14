let audioContext = null;
let recorder = null;

function resizeEvent() {
    let w_height = $(window).height();
    let w_width = $(window).width();

    $('.window_full_width').each(function() {
        $(this).width(w_width);
    });

    $('.window_full_height').each(function () {
        $(this).height(w_height);
    });
}

/*
 * Modifica o estado do botão e suas diferentes opções.
 */
const updateBotaoGravacaoEnroll = function(estado) {
    let botao = $('#enroll-lock-button');

    if(estado === 'fechada') {
        botao.removeClass();
        botao.addClass('btn');
        botao.addClass('btn-primary');
        botao.prop('disabled', false);
        botao.data('estado', estado);
        botao.html('Gravar&nbsp;<i class="fas fa-microphone"></i>');
    }
    else if(estado === 'gravando') {
        botao.removeClass();
        botao.addClass('btn');
        botao.addClass('btn-info');
        botao.prop('disabled', false);
        botao.data('estado', estado);
        botao.html('Parar Gravação e Enviar&nbsp;<i class="fas fa-paper-plane"></i>');
    }
    else if(estado === 'processando') {
        botao.removeClass();
        botao.addClass('btn');
        botao.addClass('btn-light');
        botao.prop('disabled', true);
        botao.data('estado', estado);
        botao.html('Fechar&nbsp;<i class="fas fa-lock"></i>');
    }
};

/*
 * Modifica o estado do botão e suas diferentes opções.
 */
const updateBotaoGravacao = function(estado) {
    let botao = $('#open-lock-button');

    if(estado === 'fechada') {
        botao.removeClass();
        botao.addClass('btn');
        botao.addClass('btn-primary');
        botao.prop('disabled', false);
        botao.data('estado', estado);
        botao.html('Abrir Fechadura&nbsp;<i class="fas fa-microphone"></i>');
    }
    else if(estado === 'gravando') {
        botao.removeClass();
        botao.addClass('btn');
        botao.addClass('btn-info');
        botao.prop('disabled', false);
        botao.data('estado', estado);
        botao.html('Parar Gravação e Enviar&nbsp;<i class="fas fa-paper-plane"></i>');
    }
    else if(estado === 'processando') {
        botao.removeClass();
        botao.addClass('btn');
        botao.addClass('btn-light');
        botao.prop('disabled', true);
        botao.data('estado', estado);
        botao.html('Fechar&nbsp;<i class="fas fa-lock"></i>');
    }
    else if(estado === 'aberta') {
        botao.removeClass();
        botao.addClass('btn');
        botao.addClass('btn-secondary');
        botao.prop('disabled', false);
        botao.data('estado', estado);
        botao.html('Fechar&nbsp;<i class="fas fa-lock"></i>');
    }
    else {
        botao.removeClass();
        botao.addClass('btn');
        botao.addClass('btn-danger');
        botao.prop('disabled', true);
        botao.data('estado', 'erro');
        botao.html('Erro&nbsp;<i class="fas fa-skull"></i>');
    }
};

/*
 * Função chamada quando a identidade é reconhecida com êxito.
 *
 * Atualiza o estado do botão para aberta
 */
const identidadeReconhecidaComSucesso = function() {
    updateBotaoGravacao('aberta');

    $('#open-lock-log').removeClass();
    $('#open-lock-log').addClass('alert');
    $('#open-lock-log').addClass('alert-success');
    $('#open-lock-log').text('Fechadura aberta com sucesso!');
};

/*
 * Função chamada quando a identidade não é reconhecida.
 *
 * Atualiza estado do botão para fechada (tentar novamente)
 * Atualiza mensagem da barra de status
 */
const identidadeNaoReconhecida = function () {
    updateBotaoGravacao('fechada');

    $('#open-lock-log').removeClass();
    $('#open-lock-log').addClass('alert');
    $('#open-lock-log').addClass('alert-danger');
    $('#open-lock-log').text('Frase ou identidade não reconhecida, tente novamente');
};

/*
 * Chamada quando a permissão de uso do microfone foi recebida com êxito.
 *
 * Atualiza o status do botão para gravando e inicia a gravação.
 */
const requestMicrophonePermissionEnroll = function() {
    navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(function(stream) {
        let input = audioContext.createMediaStreamSource(stream);

        recorder = new Recorder(input, {
            workerPath: '/static/js/recorderWorker.js'
        });
        recorder.record();

        updateBotaoGravacaoEnroll('gravando');

        let barraStatus = $('#enroll-lock-log');

        barraStatus.removeClass();
        barraStatus.addClass('alert');
        barraStatus.addClass('alert-success');
        barraStatus.text('Fale a sua frase secreta e pressione o botão novamente para enviar');
    });
};

/*
 * Chamada quando a permissão de uso do microfone foi recebida com êxito.
 *
 * Atualiza o status do botão para gravando e inicia a gravação.
 */
const requestMicrophonePermission = function() {
    navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(function(stream) {
        let input = audioContext.createMediaStreamSource(stream);

        recorder = new Recorder(input, {
            workerPath: '/static/js/recorderWorker.js'
        });
        recorder.record();

        updateBotaoGravacao('gravando');

        let barraStatus = $('#open-lock-log');

        barraStatus.removeClass();
        barraStatus.addClass('alert');
        barraStatus.addClass('alert-success');
        barraStatus.text('Fale a sua frase secreta e pressione o botão novamente para enviar');
    });
};

/*
 * Verifica se o site já possui a permissão do micrfone.
 * Se não possuir, solicita ao usuário que dê a permissão relevante.
 * Caso possua, inicia a gravação.
 * Caso não possua exibe a mensagem de erro.
 */
const getMicPermission = function () {
    navigator.permissions.query({name:'microphone'}).then(function(result) {
        statusBar = $('#open-lock-log');

        if(result.state === 'granted') {
            requestMicrophonePermission();
        }
        else if(result.state === 'prompt'){
            statusBar.removeClass();
            statusBar.addClass('alert');
            statusBar.addClass('alert-warning');
            statusBar.text('Por favor dê a permissão para uso do microfone');
            requestMicrophonePermission();
        }
        else if(result.state === 'denied') {
            statusBar.removeClass();
            statusBar.addClass('alert');
            statusBar.addClass('alert-danger ');
            statusBar.text('Erro ao solicitar permissão para abrir o microfone');
        }
    });
    //navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(microphonePermissionSucessHandler);
};

/*
 * Verifica se o site já possui a permissão do micrfone.
 * Se não possuir, solicita ao usuário que dê a permissão relevante.
 * Caso possua, inicia a gravação.
 * Caso não possua exibe a mensagem de erro.
 */
const getMicPermissionEnroll = function () {
    navigator.permissions.query({name:'microphone'}).then(function(result) {
        statusBar = $('#enroll-lock-log');

        if(result.state === 'granted') {
            requestMicrophonePermissionEnroll();
        }
        else if(result.state === 'prompt'){
            statusBar.removeClass();
            statusBar.addClass('alert');
            statusBar.addClass('alert-warning');
            statusBar.text('Por favor dê a permissão para uso do microfone');
            requestMicrophonePermissionEnroll();
        }
        else if(result.state === 'denied') {
            statusBar.removeClass();
            statusBar.addClass('alert');
            statusBar.addClass('alert-danger ');
            statusBar.text('Erro ao solicitar permissão para abrir o microfone');
        }
    });
    //navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(microphonePermissionSucessHandler);
};

/*
 * Função chamada por um clique no botão stop
 */
const enviarGravacao = function() {
    recorder.stop();

    recorder.exportMonoWAV(function(blob) {
        let url = URL.createObjectURL(blob);
        audioElement = $('#audio-element');
        audioElement.attr("src", url);
        audioElement.removeClass('d-none');

        let data = new FormData(document.querySelector('#upload-form'));
        data.append('audio', blob);

        $.ajax({
            type: 'POST',
            data: data,
            processData: false,
            contentType: false,
            url: $('#upload-form').attr('action'),
            beforeSend: function() {
                let statusBar = $('#open-lock-log');
                statusBar.removeClass();
                statusBar.addClass('alert');
                statusBar.addClass('alert-info');
                statusBar.text('Por favor aguarde, estamos tentando verificar sua identidade.');
                updateBotaoGravacao('processando');
            },
            success: function(data, textStatus, jqXHR) {
                let statusBar = $('#open-lock-log');

                if(data['res'] === 'ok'){
                    statusBar.removeClass();
                    statusBar.addClass('alert');
                    statusBar.addClass('alert-success');
                    statusBar.text('Fechadura aberta com sucesso');
                    updateBotaoGravacao('aberta');
                }
                else {
                    statusBar.removeClass();
                    statusBar.addClass('alert');
                    statusBar.addClass('alert-danger');
                    statusBar.text('Erro ao tentar reconhecer sua identidade, por favor, tente novamente');
                    updateBotaoGravacao('fechada');
                }
            },

        });
    });

    updateBotaoGravacao('processando');
};

/*
 * Função chamada por um clique no botão stop
 */
const enviarGravacaoEnroll = function() {
    recorder.stop();

    recorder.exportMonoWAV(function(blob) {
        let url = URL.createObjectURL(blob);
        audioElement = $('#audio-element');
        audioElement.attr("src", url);
        audioElement.removeClass('d-none');

        let data = new FormData(document.querySelector('#upload-form'));
        data.append('audio', blob);

        $.ajax({
            type: 'POST',
            data: data,
            processData: false,
            contentType: false,
            url: $('#upload-form').attr('action'),
            beforeSend: function() {
                let statusBar = $('#enroll-lock-log');
                statusBar.removeClass();
                statusBar.addClass('alert');
                statusBar.addClass('alert-info');
                statusBar.text('Por favor aguarde, processando.');
                updateBotaoGravacao('processando');
            },
            success: function(data, textStatus, jqXHR) {
                let statusBar = $('#enroll-lock-log');

                statusBar.text(JSON.stringify(data));

                updateBotaoGravacaoEnroll('fechada')
            },

        });
    });

    updateBotaoGravacaoEnroll('processando');
};

const fechar = function() {
    let data = new FormData(document.querySelector('#fechar-form'));

    $.ajax({
        type: 'POST',
        data: data,
        processData: false,
        contentType: false,
        url: $('#fechar-form').attr('action'),
        beforeSend: function() {
            let statusBar = $('#open-lock-log');
            statusBar.removeClass();
            statusBar.addClass('alert');
            statusBar.addClass('alert-info');
            statusBar.text('Por favor aguarde, fechando.');
            updateBotaoGravacao('processando');
        },
        success: function(data, textStatus, jqXHR) {
            let statusBar = $('#open-lock-log');

            statusBar.removeClass();
            statusBar.addClass('alert');
            statusBar.addClass('alert-success');
            statusBar.text('Fechadura fechada com sucesso');
            updateBotaoGravacao('fechada');
        },
        ajaxError: function () {
            let statusBar = $('#open-lock-log');

            statusBar.removeClass();
            statusBar.addClass('alert');
            statusBar.addClass('alert-danger');
            statusBar.text('Erro no envio do processo');
            updateBotaoGravacao('fechada');
        }
    });
};


$(document).ready(function() {
    audioContext = new AudioContext();

    $(window).resize(function() {
        resizeEvent();
    });

    $('#open-lock-button').click(function() {
        let state = $('#open-lock-button').data('estado');
        /*
        *  Caso a fechadura esteja fechada, quando pressionado o botão deve solicitar a permissão do microfone,
        *  e iniciar a gravação, o próximo estado é gravando.
        */
        if(state === 'fechada') {
            getMicPermission();
        }
        else if(state === 'gravando') {
            enviarGravacao();
        }
        else if(state === 'aberta') {
            fechar();
        }
    });

    $('#enroll-lock-button').click(function() {
        let state = $('#enroll-lock-button').data('estado');
        /*
        *  Caso a fechadura esteja fechada, quando pressionado o botão deve solicitar a permissão do microfone,
        *  e iniciar a gravação, o próximo estado é gravando.
        */
        if(state === 'fechada') {
            getMicPermissionEnroll();
        }
        else if(state === 'gravando') {
            enviarGravacaoEnroll();
        }
    });

    updateBotaoGravacaoEnroll('fechada');
    resizeEvent();
});
