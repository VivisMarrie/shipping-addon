var express = require("express");
var request = require("request");
var rp = require("request-promise");

var app = express();

app.use(express.json());

app.post("/orders", function (req, res) {
  //request vtex
  console.log(req.body.OrderId);

  let order = req.body.OrderId;

  let appKey = "vtexappkey-hiringcoders14-PYVTSB";
  let appToken =
    "TLAPVRTTFHVDDIIXBTDIUWDILDKLUKAMFWDQVFNKIMRJMTIGYFRYBIEWIRDRHIZUHIXHFRCVFSAIFTVRVEMOSBLXRHIDCWDZMWCDVAAHDWSIHWRPWMVCVLBFXAQXJYTJ";

  var options = {
    method: "GET",
    uri: "https://hiringcoders14.myvtex.com/api/oms/pvt/orders/" + order,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-VTEX-API-AppKey": appKey,
      "X-VTEX-API-AppToken": appToken,
      Cookie: "janus_sid=3f0982b7-1f01-404f-b37c-4c7a964ea0fe",
    },
    json: true,
  };

  //request vtex
  rp(options)
    .then(function (body) {
      //request
      rp(options)
        .then(function (body) {
          rp(options)
            .then(function (body) {})
            .catch(function (err) {});
        })
        .catch(function (err) {});
    })
    .catch(function (err) {});

  //faz post pro tracking
  // order.orderId
  // order.value
  // order.shippingData.address{
  //   "address": {
  //     "addressType": "residential",
  //     "receiverName": "Alessandro Silva",
  //     "addressId": "4801622989341",
  //     "postalCode": "84662-000",
  //     "city": "Colônia General Carneiro",
  //     "state": "PR",
  //     "country": "BRA",
  //     "street": "Rua Rosa, 2",
  //     "number": "1156",
  //     "neighborhood": "Centro",
  //     "complement": null,
  //     "reference": null,
  //     "geoCoordinates": [
  //         -51.313480377197266,
  //         -26.429201126098633
  //     ]
  //   }
  // }
  // order.items [quantity, dimension.cubicweight]

  //faz request de criar pedido
  let reqAddtocart = montaBodyAddToCart();
  request(reqAddtocart, function (error, response) {
    if (error) throw new Error(error);
    console.log("add to cart:", response.body);
  });

  //faz request de finalizar etiiqueta
  let reqCheckout = montaBodyCheckout();
  request(reqCheckout, function (error, response) {
    if (error) throw new Error(error);
    console.log("checkout", response.body);
  });

  res.end("yes");
});

app.listen(3000, function () {
  console.log("listening on port 3000!");
});

function montaBodyAddToCart() {
  let body = "";
  body = `{
            "service": 1,
            "agency": 49,
            "from": {
                "name": "Nome do remetente",
                "phone": "53984470102",
                "email": "contato@melhorenvio.com.br",
                "document": "16571478358",
                "company_document": "89794131000100",
                "state_register": "123456",
                "address": "Endereço do remetente",
                "complement": "Complemento",
                "number": "1",
                "district": "Bairro",
                "city": "São Paulo",
                "country_id": "BR",
                "postal_code": "01002001",
                "note": "observação"
            },
            "to": {
                "name": "Nome do destinatário",
                "phone": "53984470102",
                "email": "contato@melhorenvio.com.br",
                "document": "25404918047",
                "company_document": "89794131000101",
                "state_register": "123456",
                "address": "Endereço do destinatário",
                "complement": "Complemento",
                "number": "2",
                "district": "Bairro",
                "city": "Porto Alegre",
                "state_abbr": "RS",
                "country_id": "BR",
                "postal_code": "90570020",
                "note": "observação"
            },
            "products": [
                {
                    "name": "Papel adesivo para etiquetas 1",
                    "quantity": 3,
                    "unitary_value": 1000
                },
                {
                    "name": "Papel adesivo para etiquetas 2",
                    "quantity": 1,
                    "unitary_value": 1000
                }
            ],
            "volumes": [
                {
                    "height": 15,
                    "width": 20,
                    "length": 10,
                    "weight": 3
                }
            ],
            "options": {
                "insurance_value": 0,
                "receipt": false,
                "own_hand": false,
                "reverse": false,
                "non_commercial": false,
                "invoice": {
                    "key": "31190307586261000184550010000092481404848162"
                },
                "platform": "VTEX",
                "tags": [
                    {
                        "tag": "Identificação do pedido na plataforma, exemplo: 1000007",
                        "url": "Link direto para o pedido na plataforma, se possível, caso contrário pode ser passado o valor null"
                    }
                ]
            }
        }`;

  var options = {
    method: "POST",
    url: "https://sandbox.melhorenvio.com.br/api/v2/me/cart",
    headers: {
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjVjYTdiMThkMjc1ZDcxMTFhNTgxNmUwMmY2NmM5YzU4YWQ4OWYzNzhmNDkxM2JiYmZjNjg1ZTMyNjY0MjBhYWI0MzI3MWMxZTEyNGI3MDBmIn0.eyJhdWQiOiIxIiwianRpIjoiNWNhN2IxOGQyNzVkNzExMWE1ODE2ZTAyZjY2YzljNThhZDg5ZjM3OGY0OTEzYmJiZmM2ODVlMzI2NjQyMGFhYjQzMjcxYzFlMTI0YjcwMGYiLCJpYXQiOjE2MDA5MDM3NzQsIm5iZiI6MTYwMDkwMzc3NCwiZXhwIjoxNjMyNDM5Nzc0LCJzdWIiOiJmMjgwMTFmYi03ZTY4LTRmY2QtYmE2NS0wMDI2ZTg5Y2UzMjQiLCJzY29wZXMiOlsiY2FydC1yZWFkIiwiY2FydC13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiY29tcGFuaWVzLXdyaXRlIiwiY291cG9ucy1yZWFkIiwiY291cG9ucy13cml0ZSIsIm5vdGlmaWNhdGlvbnMtcmVhZCIsIm9yZGVycy1yZWFkIiwicHJvZHVjdHMtcmVhZCIsInByb2R1Y3RzLXdyaXRlIiwicHVyY2hhc2VzLXJlYWQiLCJzaGlwcGluZy1jYWxjdWxhdGUiLCJzaGlwcGluZy1jYW5jZWwiLCJzaGlwcGluZy1jaGVja291dCIsInNoaXBwaW5nLWNvbXBhbmllcyIsInNoaXBwaW5nLWdlbmVyYXRlIiwic2hpcHBpbmctcHJldmlldyIsInNoaXBwaW5nLXByaW50Iiwic2hpcHBpbmctc2hhcmUiLCJzaGlwcGluZy10cmFja2luZyIsImVjb21tZXJjZS1zaGlwcGluZyIsInRyYW5zYWN0aW9ucy1yZWFkIiwidXNlcnMtcmVhZCIsInVzZXJzLXdyaXRlIiwid2ViaG9va3MtcmVhZCIsIndlYmhvb2tzLXdyaXRlIl19.mLeyk-Q1vugXy1yA5h80LKyD3d9-pbMmN7iwymbL_F-JWZqYqHlvhIM3U_B9O-u4_LyhoEvj08L2lOt9CiiJ8qfLyX-1UKfW7pThN3fC_WiBv43zN0uiqNrq03Jeg_QHz_9DJMPy7zV8vc7mExVGGURqi0n2hN_AU6BfQt9NqWieX0D-IsF9GGr3ZexHHvA13krVl59xzkjF0AZ6cdqMQUBbX6tjzmWpt701SNhWXzoZwoAGBLmGg1Nw32S73CxUr3fUxaXf6_yOqGa0NlklrzKr74LocKTzzRxoO3khhXff8kgl0mL72Rs8I-dvjIWM6agR7ZRrxt2RXc_sCX-Da1IQRHBg4HL92enB5XRyX-J9jUY2ETf6M15EEj84N2gLEQdsUvNNud2UiJLfsBZQiAxcRpD6hHkX5QeBU9bxBsXn_93vZ7FSRjGBrOD8OQkuGM3c5GpUZvZBOxtwDFoE5sJQsBNL3okdBTSi39uWlzH6E_DpnCaUYfpLlGHRHSkObzVm2Lw8cdaPf4G_zrH_EmiOsc0RDYVLqKDbsEIe2iD7VYt9GnbQ36JTMlQLTfKvV4HBCGhuJqknTUWCRFvO4IXJHbcPNUARcJr2-aJxTnWkMydMreiTRhoiYkVpXNRYqQFYKYHfThvvuSen_NWMj7FSQBON3PsLcrBbvk5aGNI",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body,
  };

  return options;
}

function montaBodyCheckout(cartid) {
  let body;
  body = `{
    "orders": [
        "${cartid}"
    ]
  }`;

  var options = {
    method: "POST",
    url: "https://sandbox.melhorenvio.com.br/api/v2/me/shipment/checkout",
    headers: {
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjVjYTdiMThkMjc1ZDcxMTFhNTgxNmUwMmY2NmM5YzU4YWQ4OWYzNzhmNDkxM2JiYmZjNjg1ZTMyNjY0MjBhYWI0MzI3MWMxZTEyNGI3MDBmIn0.eyJhdWQiOiIxIiwianRpIjoiNWNhN2IxOGQyNzVkNzExMWE1ODE2ZTAyZjY2YzljNThhZDg5ZjM3OGY0OTEzYmJiZmM2ODVlMzI2NjQyMGFhYjQzMjcxYzFlMTI0YjcwMGYiLCJpYXQiOjE2MDA5MDM3NzQsIm5iZiI6MTYwMDkwMzc3NCwiZXhwIjoxNjMyNDM5Nzc0LCJzdWIiOiJmMjgwMTFmYi03ZTY4LTRmY2QtYmE2NS0wMDI2ZTg5Y2UzMjQiLCJzY29wZXMiOlsiY2FydC1yZWFkIiwiY2FydC13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiY29tcGFuaWVzLXdyaXRlIiwiY291cG9ucy1yZWFkIiwiY291cG9ucy13cml0ZSIsIm5vdGlmaWNhdGlvbnMtcmVhZCIsIm9yZGVycy1yZWFkIiwicHJvZHVjdHMtcmVhZCIsInByb2R1Y3RzLXdyaXRlIiwicHVyY2hhc2VzLXJlYWQiLCJzaGlwcGluZy1jYWxjdWxhdGUiLCJzaGlwcGluZy1jYW5jZWwiLCJzaGlwcGluZy1jaGVja291dCIsInNoaXBwaW5nLWNvbXBhbmllcyIsInNoaXBwaW5nLWdlbmVyYXRlIiwic2hpcHBpbmctcHJldmlldyIsInNoaXBwaW5nLXByaW50Iiwic2hpcHBpbmctc2hhcmUiLCJzaGlwcGluZy10cmFja2luZyIsImVjb21tZXJjZS1zaGlwcGluZyIsInRyYW5zYWN0aW9ucy1yZWFkIiwidXNlcnMtcmVhZCIsInVzZXJzLXdyaXRlIiwid2ViaG9va3MtcmVhZCIsIndlYmhvb2tzLXdyaXRlIl19.mLeyk-Q1vugXy1yA5h80LKyD3d9-pbMmN7iwymbL_F-JWZqYqHlvhIM3U_B9O-u4_LyhoEvj08L2lOt9CiiJ8qfLyX-1UKfW7pThN3fC_WiBv43zN0uiqNrq03Jeg_QHz_9DJMPy7zV8vc7mExVGGURqi0n2hN_AU6BfQt9NqWieX0D-IsF9GGr3ZexHHvA13krVl59xzkjF0AZ6cdqMQUBbX6tjzmWpt701SNhWXzoZwoAGBLmGg1Nw32S73CxUr3fUxaXf6_yOqGa0NlklrzKr74LocKTzzRxoO3khhXff8kgl0mL72Rs8I-dvjIWM6agR7ZRrxt2RXc_sCX-Da1IQRHBg4HL92enB5XRyX-J9jUY2ETf6M15EEj84N2gLEQdsUvNNud2UiJLfsBZQiAxcRpD6hHkX5QeBU9bxBsXn_93vZ7FSRjGBrOD8OQkuGM3c5GpUZvZBOxtwDFoE5sJQsBNL3okdBTSi39uWlzH6E_DpnCaUYfpLlGHRHSkObzVm2Lw8cdaPf4G_zrH_EmiOsc0RDYVLqKDbsEIe2iD7VYt9GnbQ36JTMlQLTfKvV4HBCGhuJqknTUWCRFvO4IXJHbcPNUARcJr2-aJxTnWkMydMreiTRhoiYkVpXNRYqQFYKYHfThvvuSen_NWMj7FSQBON3PsLcrBbvk5aGNI",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body,
  };

  return options;
}
