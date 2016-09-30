'use strict';

const fs = require('fs');
const handlebars = require('handlebars');

const presentation = JSON.parse(fs.readFileSync(`${__dirname}/../data.json`, {encoding: 'utf-8'}));
const wrapperTpl = fs.readFileSync(`${__dirname}/../templates/index.hbs`, {encoding: 'utf-8'});
const headerTpl = fs.readFileSync(`${__dirname}/../templates/header.hbs`, {encoding: 'utf-8'});
const listTpl = fs.readFileSync(`${__dirname}/../templates/list.hbs`, {encoding: 'utf-8'});

const wrapper = handlebars.compile(wrapperTpl);
const header = handlebars.compile(headerTpl);
const list = handlebars.compile(listTpl);

let slidesHTML = '';
for (let slide of presentation.slides) {
    slide.elements.forEach((element, i) => {
        const data = {
            title: slide.title,
            slides: slide.elements.map((text, j) => ({
                text,
                active: (i === j)
            }))
        };

        slidesHTML += list(data);
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
