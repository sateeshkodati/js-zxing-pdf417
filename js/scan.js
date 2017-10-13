function doScan(image) {
    var
            canvas = document.createElement('canvas'),
            canvas_context = canvas.getContext('2d'),
            source,
            binarizer,
            bitmap;

    $('.error').empty();
    $('.decodedText').empty();

    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;
    canvas_context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
    // canvas_context.drawImage(image, 0, 0);

    try {
        source = new ZXing.BitmapLuminanceSource(canvas_context, image);
        binarizer = new ZXing.Common.HybridBinarizer(source);
        bitmap = new ZXing.BinaryBitmap(binarizer);
        var dl = ZXing.PDF417.PDF417Reader.decode(bitmap, null, false);
        $('.decodedText').text(JSON.stringify(dl, null, 4));
    } catch (err) {
        $('.error').text(err);
    }
}

(function(window, $, undefined) {
    $(function() {

        function handleFiles(f) {
            var img = $('#loadedDLPhoto');
            img[0].src = URL.createObjectURL(f.target.files[0]);
        }

        $('#decode').click(function() {
            doScan($('#loadedDLPhoto')[0]);
        });

        $('#loadedDLPhoto').load(function() {
            doScan($('#loadedDLPhoto')[0]);
        });

        $('#file').change(handleFiles);
    });
})(window, window.jQuery);