const nodemailer = require('nodemailer');

module.exports = {
    callme: async ({body}) => {
        const {phone, product, name, address, square, channel, listCalculates} = body;

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            'tls.servername': 587,
            secure: true,
            auth: {
                user: 'masterpola72t@gmail.com',
                pass: 'master060200'
            }
        });


        let text = `Имя: ${name}, номер телефона: ${phone}`,
            emailHtml = `
            <b>Новая заявка на обратный звонок</b>
            <p> Имя: <b> ${name} </b> </p>
            <p> Номер телефона: <b> ${phone} </b> </p>
            <p> Геопозиция: ${JSON.stringify(address)} </p>
         `;


        if (square || channel) {
            emailHtml += ` 
                 <div> 
                        <h4> Заявка на рассчет</h4></br>
                        <b> Площадь: ${square} </b></br>
                        <b> Способ связи: ${channel} </b></br>
                        <b> Дополнительно: ${listCalculates.concat(',')} </b></br>
                  </div>
        `;
        }

        if (product?.alias) {
            const img = `https://master-pola.com${product.img}`;

            text += `Код товара: ${product.id}, ${product.name}`;
            emailHtml += ` 
                 <div> 
                     <h4> Товар ${product.name}, ссылка: https://master-pola.com/product/${product.alias}</h4>
                     <img src=${img} height="400px"/>
                  </div>
        `;
        }


        await transporter.sendMail({
            from: 'masterpola72t@gmail.com',
            to: 'kriska_555@mail.ru',
            subject: 'Заявка на обратный звонок ✔',
            text: text,
            html: emailHtml
        });
        
        const info = await transporter.sendMail({
            from: 'masterpola72t@gmail.com',
            to: 'masterpola72@mail.ru',
            subject: 'Заявка на обратный звонок ✔',
            text: text,
            html: emailHtml
        });

        console.log('Message sent: %s', info.messageId);
        return {};
    }
};
