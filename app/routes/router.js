
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");


const transportador = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


router.get("/", (req, res) => {
    res.render("pages/contato", {
        erros: [],
        dados: {},
        sucesso: ""
    });
});


router.post("/enviar", [
    body("nome").trim().notEmpty().withMessage("Digite seu proprio nome"),
    body("email").trim().isEmail().withMessage("Digite um e-mail alternativo"),
    body("telefone").trim().notEmpty().withMessage("Digite o seu telefone"),
    body("assunto").trim().notEmpty().withMessage("Digite o assunto alvo"),
    body("mensagem").trim().notEmpty().withMessage("Digite sua mensagem desejada")
], (req, res) => {

    const erros = validationResult(req);

    if (!erros.isEmpty()) {
        return res.render("pages/contato", {
            erros: erros.array(),
            dados: req.body,
            sucesso: ""
        });
    }

    const { nome, email, telefone, assunto, mensagem } = req.body;

    const emailEnviar = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: assunto,
        text: 
        `
        Nome: ${nome}
        E-mail: ${email}
        Telefone: ${telefone}
        Assunto: ${assunto}
        Mensagem:${mensagem}
        `
    };

    transportador.sendMail(emailEnviar, (erro, informacoes) => {

        if (erro) {
            console.log("Erro ao enviar:", erro);

            return res.render("pages/contato", {
                erros: [],
                dados: req.body,
                sucesso: "Erro ao enviar e-mail."
            });
        }

        console.log("E-mail enviado:", informacoes.response);

        res.render("pages/contato", {
            erros: [],
            dados: {},
            sucesso: "E-mail enviado com sucesso!"
        });
    });
});

module.exports = router;
