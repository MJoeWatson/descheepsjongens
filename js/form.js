var LPAWS = {};
var SES = {};
AWS.config.region = 'eu-west-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'eu-west-1:f0683e77-1d3c-4ffd-9485-0311d408a766',
});

LPAWS.sendToTopic = function() {
    var sns = new AWS.SNS();
    var params = {
        //Message: 'Hello topic', /* required */
        Message: "Naam: " + document.querySelector('#voornaam').value + ' ' + document.querySelector('#achternaam').value + '\n' +
                'Adres: ' +  document.querySelector('#adres').value + '\n' +
                'Email: ' +  document.querySelector('#email').value + '\n' +
                'Telefoon: ' +  document.querySelector('#tel').value + '\n' +
                'Gewenste Vaardag: ' +  document.querySelector('#date').value + '\n' +
                'Dagdeel: ' +  document.querySelector('#dagdeel').value + '\n' +
                'Boot: ' +  document.querySelector('#boot').value +'\n' +
                'Personen: ' +  document.querySelector('#person').value + 'a.p.\n' +
                'Bericht: ' +  document.querySelector('#bericht').value,
        Subject: 'Boot Reserveren - ' + document.querySelector('#voornaam').value + ' ' + document.querySelector('#achternaam').value,
        TopicArn: 'arn:aws:sns:eu-west-1:257995789702:descheepsjongens_reserv'
    };
    sns.publish(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
    return true;
};

SES.sendEmail = function() {
    var ses = new AWS.SES();
    var params = {
      Destination: {
        ToAddresses: [
          'descheepsjongens@gmail.com'
        ]
      },
      ReplyToAddresses: [
        document.querySelector('#email').value
      ],
      Source: 'descheepsjongens@gmail.com',
      ConfigurationSetName: 'descheepsjongens',
      Template: 'reservation',
      TemplateData: `{ \"name\": \"${document.querySelector('#voornaam').value} ${document.querySelector('#achternaam').value}\",
        \"address\": \"${document.querySelector('#adres').value}\",
        \"city\": \"${document.querySelector('#woonplaats').value}\",
        \"email\": \"${document.querySelector('#email').value}\",
        \"address\": \"${document.querySelector('#adres').value}\",
        \"phone\": \"${document.querySelector('#tel').value}\",
        \"day\": \"${document.querySelector('#date').value}\",
        \"time\": \"${document.querySelector('#dagdeel').value}\",
        \"boat\": \"${document.querySelector('#boot').value}\",
        \"number\": \"${document.querySelector('#person').value}\",
        \"message\": \"${document.querySelector('#bericht').value}\"

      }`
    };
    ses.sendTemplatedEmail(params, function(err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
        contactsupport.style.display = "block";
        formsuccess.style.display = "none";
      }
      else {
        console.log(data);           // successful response
        contactsupport.style.display = "none";
        formsuccess.style.display = "block";
      }
    });

    var form_params = {
      Destination: {
        ToAddresses: [
          document.querySelector('#email').value
        ]
      },
      ReplyToAddresses: [
        'descheepsjongens@gmail.com'
      ],
      Source: 'descheepsjongens@gmail.com',
      ConfigurationSetName: 'descheepsjongens',
      Template: 'form-submitted-real',
      TemplateData: `{ \"name\": \"${document.querySelector('#voornaam').value}\"

      }`
    };
    ses.sendTemplatedEmail(form_params, function(err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
        contactsupport.style.display = "block";
        formsuccess.style.display = "none";
      }
      else {
        console.log(data);           // successful response
        contactsupport.style.display = "none";
        formsuccess.style.display = "block";
      }
    });

    return true;
};


function validateForm() {
    var failed = false;
    var i;
    var x = document.getElementsByClassName("forminput");
    var age_check = document.getElementById("age")
    var age_label = document.getElementById("agelabel")
    var w = document.getElementById("formwarning");
    var formsuccess = document.getElementById("formsuccess");
    console.log(w)
    for (i = 0; i < x.length; i++) {
      if(!x[i].value) {
        x[i].style.border = "2px solid red";
        var failed = true;
      } else {
        x[i].style.border = "";
      }
    }

    // if(!age_check.checked) {
    //   age_label.style.color = "red";
    //   var failed = true;
    // } else {
    //   age_label.style.color = "black";
    // }

    console.log(failed)
    if (failed) {
      w.style.display = "block";
      formsuccess.style.display = "none";
      return;
    } else {
      w.style.display = "none";
    }
    if (!failed) {
      try {
        SES.sendEmail();
      }
      catch(err) {
        throw err;
      }

    }

}
