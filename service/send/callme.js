const nodemailer = require("nodemailer");

module.exports = {
    callme: async ({body, knex}) => {
        const {phone, product, name} = body;

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            'tls.servername': 587,
            secure: true,
            auth: {
                user: 'masterpola72t@gmail.com',
                pass: 'master568100',
            },
        });


        let text = `Имя: ${name}, номер телефона: ${phone}`,
            emailHtml = `
            <b>Новая заявка на обратный звонок</b>
            <p> Имя: <b> ${name} </b> </p>
            <p> Номер телефона: <b> ${phone} </b> </p>
         `;

        if (product) {
            text += `Код товара: ${product.id}, ${product.name}`;
            emailHtml += ` 
                 <div> 
                     <h4> Товар ${product.name}, код товара на сайте:${product.id}</h4>
                     <img src=${product.img} height="400px"/>
                  </div>
        `;
        }

        const info = await transporter.sendMail({
            from: 'ash12hka@gmail.com',
            to: "kriska_555@mail.ru",
            subject: "Заявка на обратный звонок ✔",
            text: text,
            html: emailHtml
        });

        console.log("Message sent: %s", info.messageId);
    }
};
