'use strict';

const fs = require('fs');
const handlebars = require('handlebars');

const presentation = JSON.parse(fs.readFileSync(`${__dirname}/../data.json`, {encoding: 'utf-8'}));
const wrapperTpl = fs.readFileSync(`${__dirname}/../templates/index.hbs`, {encoding: 'utf-8'});
const headerTpl = fs.readFileSync(`${__dirname}/../templates/header.hbs`, {encoding: 'utf-8'});
const listTpl = fs.readFileSync(`${__dirname}/../templates/list.hbs`, {encoding: 'utf-8'});
const simpleListTpl = fs.readFileSync(`${__dirname}/../templates/simple-list.hbs`, {encoding: 'utf-8'});
const codeTpl = fs.readFileSync(`${__dirname}/../templates/code.hbs`, {encoding: 'utf-8'});

const wrapper = handlebars.compile(wrapperTpl);
const header = handlebars.compile(headerTpl);
const list = handlebars.compile(listTpl);
const simpleList = handlebars.compile(simpleListTpl);
const code = handlebars.compile(codeTpl);

let slidesHTML = '';
for (let slide of presentation.slides) {
    slide.elements.forEach((element, i) => {
        const data = {
            title: slide.title,
            slides: slide.elements.map((element, j) => {
                const text = (typeof element === 'object')
                    ? element.text
                    : element;

                return {
                    text,
                    active: (i === j)
                };
            })
        };

        slidesHTML += list(data);

        if (typeof element === 'object') {
            if (element.insiders) {
                slidesHTML += simpleList({
                    title: `${slide.title} > ${element.text}`,
                    elements: element.insiders
                });
            } else if (element.code) {
                slidesHTML += code({
                    title: `${slide.title} > ${element.text}`,
                    code: element.code
                });
            }
        }
    });
}

const headerHTML = header({
    title: presentation.header.title,
    author: presentation.header.author.name,
    email: presentation.header.author.email
});

fs.writeFileSync(`${__dirname}/../index.html`, wrapper({
    title: `${presentation.header.title} &mdash; ${presentation.header.author.name}`,
    header: headerHTML,
    slides: slidesHTML,
    repo: '1999/dom'
}));
