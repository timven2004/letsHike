# 2021-02-03 Review

-   [ ] HTML Text Editor

    -   https://quilljs.com/

    -   https://editorjs.io/

-   [ ] Calendar

    -   https://fullcalendar.io/

-   [ ] email

    -   https://nodemailer.com/about/

    -   https://www.npmjs.com/package/mailgun-js

-   [ ] QR Code

    -   https://davidshimjs.github.io/qrcodejs/

    -   https://www.sitepoint.com/create-qr-code-reader-mobile-website/

    -   https://medium.com/@minhazav/qr-code-scanner-using-html-and-javascript-3895a0c110cd

&nbsp;

## Random Notes

```Javascript
const filename = req.file.filename;
```

```Javascript
const file = req.file; // undefined
const filename = file.filename;
```

&nbsp;

```Javascript
const filename = req.file?.filename;
```

```Javascript
const file = req.file; // if undefined -> stop, and set filename = undefined
const filename = file.filename;
```
