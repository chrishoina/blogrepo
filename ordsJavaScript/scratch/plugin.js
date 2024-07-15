  function decodeJwt(newjwt) {
    var headerJwt = newjwt.split(".")[0];
    var headerJwtdecoded = atob(headerJwt);
    
    var payloadJwt = newjwt.split(".")[1];
    var payloadJwtdecoded = atob(payloadJwt);

    var signatureJwt = newjwt.split(".")[2];
    // var signatureJwtdecoded = atob(signatureJwt);

    // var signatureJwtBase64 = signatureJwt.replace(/-/g, "+").replace(/_/g, "/");
    // var signatureJwtBase64decoded = atob(signatureJwtBase64);

    console.log(headerJwt, payloadJwt, signatureJwt);

    console.log(headerJwtdecoded, payloadJwtdecoded);

    return(headerJwt, payloadJwt);
  };


decodeJwt("eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImtvLTFYbjJjVTE2ak5VQzF1cUFqYXhhcHUxayJ9.eyJ2ZXIiOiIyLjAiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vOTE4ODA0MGQtNmM2Ny00YzViLWIxMTItMzZhMzA0YjY2ZGFkL3YyLjAiLCJzdWIiOiJBQUFBQUFBQUFBQUFBQUFBQUFBQUFKN0lJV0NabVRIcFozWGJDeDRMQWFZIiwiYXVkIjoiZjRkOGE1NjYtMmZlMS00ODk0LWExMzItYzJkYjI2Y2IzNDdmIiwiZXhwIjoxNzEzODc0MzcxLCJpYXQiOjE3MTM4NzA0NzEsIm5iZiI6MTcxMzg3MDQ3MSwibmFtZSI6IkNocmlzIEhvaW5hIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiY2hyaXNob2luYUBnbWFpbC5jb20iLCJvaWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMWYxNi01MzBkZjY1YzA4ZjciLCJ0aWQiOiI5MTg4MDQwZC02YzY3LTRjNWItYjExMi0zNmEzMDRiNjZkYWQiLCJhenAiOiJmNGQ4YTU2Ni0yZmUxLTQ4OTQtYTEzMi1jMmRiMjZjYjM0N2YiLCJzY3AiOiJhenVyZS5vcmRzLmp3dC5wcml2aWxlZ2UiLCJhenBhY3IiOiIxIiwidXRpIjoiTDZKWS1MRXNoazV6VUpVQUFBQUFBQSIsImFpbyI6IkR0UlJTVkp1dTlFUFZmaGx4MTFhOHEyKjF2dkZWOU5yMndFUm4xeTg1QXZpaUwwdENyOWxpa0lycSpGWWhpMEhOeXJGQVpaY0QqTGlOUGdNU3pXZkVnRVVXa1drUWtOM0ZuRUhqZ1FsNlZXbVdrR2t5SHFSTW03dlpseFVmMDBzV2VMaCFaSWNaUXZrYTF4Q3J3QzFsemZLdFREKmUqIWZkQ2dKQ3B4eUVVaTgifQ.pa8ZEZXnO1SDFJYCt922ZavevQQBsnzHwZUrLEsXXt2j0wtaHSQ124LWZhxJzkHr4QHnIITYNoonWV8JlhKmNVAjJ6hSA5MnH-YARWyn6xbJe0B8C1sKJU-YWf9m6Tu0DFZCHJv0xat5gBpdkpLEnczqQLzBNZTmGUgutlldhOY6Hoo_0fxJnBLdfqfy4mVt8JXeuoXvsJVU7KUfVztnIzjKqiT4V6fIMLTaQteF7BB4IZiYU2c1wHGL6PqgNzp8hlWHUmd_Kb_MfD8IGewi0GiTinG8q-uxAhilGBfEB48tXsi8q2id3cGfM1hwKiBYCPNz5EZzsqACAWcH_LwwbA");


