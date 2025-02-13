const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} = require("@bot-whatsapp/bot");
require('dotenv').config();

const axios = require("axios");

const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");

const flowGracias = addKeyword(["gracias", "grac"]).addAnswer(
  [
    "Gracias por comunicarte con nosotros, *Tu Patrimonio Inmobiliaria* 🏚️🏘️.\n\n",
    "Te atiende con gusto *Susie*.\n",
  ],
  null,
  null,
  []
);

let correo = "";
let url = "";
let telefono = "";
let nombreE = "";
let mensaje = "";

const flowcontinuar = addKeyword([

  "ok",
  "okk",
  "ookk",
  "okk"
])
  .addAnswer([
    "Hola!",
    "Para darte un mejor \nservicio, podrías \nproporcionarme la \nsiguiente información 💾",
  ])
  .addAnswer(
    [`Escribe tu *Nombre*:`],
    { capture: true },
    async (ctx, { fallBack }) => {
      correo = ctx.body;

      // // Guardamos el correo y mostramos los datos completos
    }
  )
  .addAnswer([`¡Gracias por continuar, Ahora, ¿qué te gustaría compartir? 🤔`])

  .addAnswer(
    [
      "Si tienes un *link* de una propiedad que te interesa, puedes compartirlo aquí.\n  O si prefieres, también puedes dejar tu *comentario* o *pregunta*.",
    ],

    { capture: true, delay: 800 },
    async (ctx, { flowDynamic }) => {
      mensaje = ctx.body;

      if (mensaje != "") {
        const options = {
          method: "POST",
          url: "https://api.easybroker.com/v1/contact_requests",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            "X-Authorization": 'bsytg8rgtuuhm952r71yp0lxs9y46k',
          },
          data: {
            name: String(nombreE),
            phone: telefono,
            source: "Whatsapp ChatBot",
            message: `De: ${correo}\n\n${mensaje}`,
          },
        };

        // Realizar la solicitud HTTP con axios

        // console.log(options);
        setTimeout(() => {
          axios
            .request(options)
            .then((res) => {
              console.log("Solicitud enviada correctamente:", res.data);
            })
            .catch((err) => {
              console.error("Error al enviar la solicitud:", err);
            });
        }, 500);
      }

      await flowDynamic(
        `¡Gracias!\n\n- *Nombre*: ${correo}\n\n¡Gracias por registrarte!`
      );
    }
  )
  .addAnswer(
    ["Ahora te decimos que asesor te va atender"],
    { delay: 1000 },
    async (ctx, { endFlow }) => {
      return endFlow({
        body: `¡Gracias por tu paciencia y confianza!`,
      });
    }
  );

const flowFormulario = addKeyword([

"si",
"sii",
"ssi",
"yes",
"yea"
])
  .addAnswer([
    "Hola!",
    "Para darte un mejor \nservicio, podrías \nproporcionarme la \nsiguiente información 💾",
  ])
  .addAnswer(
    [`Escribe tu *Nombre*:`],
    { capture: true },
    async (ctx, { fallBack }) => {
      correo = ctx.body;
      // Verificamos si el correo es válido

    }
  )
  .addAnswer(
    [`¿Cómo podemos ayudarte?`],
    { capture: true },
    async (ctx, { flowDynamic }) => {
      mensaje = ctx.body;

      if (url != "") {
        const options = {
          method: "POST",
          url: "https://api.easybroker.com/v1/contact_requests",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            "X-Authorization": 'bsytg8rgtuuhm952r71yp0lxs9y46k',
          },
          data: {
            name: String(nombreE),
            phone: telefono,
            source: "Whatsapp ChatBot desde un provedor de anuncio",
            message: `De: ${correo}\n\nEstoy interesado en la propiedad ${url[0]}\n${mensaje}`,
          },
        };

        // Realizar la solicitud HTTP con axios

        // console.log(options);
        setTimeout(() => {
          axios
            .request(options)
            .then((res) => {
              console.log("Solicitud enviada correctamente:", res.data);
            })
            .catch((err) => {
              console.error("Error al enviar la solicitud:", err);
            });
        }, 500);
      }

      await flowDynamic(
        `¡Gracias!\n\n- *Nombre*: ${correo}\n\n¡Gracias por registrarte!`
      );
    }
  )
  .addAnswer(
    ["Ahora te decimos que asesor te va atender"],
    { delay: 1000 },
    async (ctx, { endFlow }) => {
      return endFlow({
        body: `¡Gracias por tu paciencia y confianza!`,
      });
    }
  );

const flowPrincipal = addKeyword([
  "hola",
"hola,",
  "interesado",
  "información",
  "informacion",
  "preguntas",
  "recibir",
  "gustaría",
  "gustaria"
])
  // .addAnswer("")
  .addAnswer(
    [
      //   "Parece que has enviado un mensaje. Estoy aquí para ayudarte.",
      "Gracias por comunicarte a \n*Tu Patrimonio Inmobiliaria* 🏚️🏘️ \nte atiende con gustó *Susie*.\n",
    ],
    null,
    async (ctx, { flowDynamic }) => {
      const mensaje = ctx.body; // Capturamos el mensaje del usuario

      // Expresión regular para detectar URLs en el mensaje
      const contieneURL = mensaje.match(/https?:\/\/[^\s]+/i);

      if (contieneURL) {
        
        telefono = ctx.from;
        nombreE = ctx.pushName;

        url = contieneURL;


 
        await flowDynamic([
          {
            body: "Por favor escribe la palabra *SI* \nPara darle prioridad a tu mensaje \ny atenderte de inmediato",
            delay: 700,
          },
        ]);


   
      } else {
        // Respuesta genérica para otros mensajes
        telefono = ctx.from;
        nombreE = ctx.pushName;

        await flowDynamic([
          {
            body: "Por favor escribe la palabra *OK* \nPara darle prioridad a tu mensaje \ny atenderte de inmediato",
            delay: 700,
          },
        ]);

        // return endFlow({
        //   body: `No detecte tu información \n¿En que más puedo ayudarte o quieres que te contacte un asesor?`,
        // });
      }

      // console.log("Mensaje recibido:", mensaje); // Para depuración
    },
    [flowGracias, flowFormulario, flowcontinuar] // Otros flujos que se integren
  );

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([flowPrincipal]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
  setInterval(() => {
    console.log("Bot activo: evitando suspensión...");
  }, 300000); // Cada 5 minutos
};

main();
