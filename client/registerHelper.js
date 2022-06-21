/**
 * Created by daoez19 on 7/1/17.
 */
import { accounting } from 'accounting';
import moment from 'moment';

// const accounting = require('accounting');

UI.registerHelper("money", function (amount) {
    return accounting.formatMoney(amount, 'Rp. ', 0, ".", ",-");
});

UI.registerHelper("date", function (date) {
    var m = moment(date);
    return m.format("DD MMM YYYY");
});
UI.registerHelper("dateDay", function (date) {
    var m = moment(date);
    return m.format("DD MMM YYYY ddd");
});
UI.registerHelper("dateTime", function (date) {
    var m = moment(date);
    return m.format("DD MMM YYYY hh:mm:ss");
});
UI.registerHelper("unixDateTime", function (date) {
    return moment.unix(date).format("DD MMM YYYY hh:mm:ss");
});


UI.registerHelper("sTime", function (date) {
    var m = moment(date);
    return m.format("hh:mm");
});
UI.registerHelper('isChecked', function (val) {
    return val ? 'checked' : '';
});
UI.registerHelper('isSelected', function (val) {
    return val ? 'selected' : '';
});
Template.registerHelper("isTable", function () {
    let instance = Template.instance(); //for easy use
    return instance.data && instance.data.isTable;
});
Template.registerHelper("selectedIfEquals", function (left, right) {
    return left == right ? "selected" : "";
});
Template.registerHelper("isZero", function (num) {
    return (num === 0) ? true : false;
});

Template.registerHelper("not", function (bool) {
    return !bool;
});

Template.registerHelper("eq", function (v1, v2, options) {
    return (v1 === v2) ? true : false;
});

Template.registerHelper("ne", function (v1, v2, options) {
    return (v1 !== v2) ? true : false;
});

Template.registerHelper("lt", function (v1, v2, options) {
    return (v1 < v2) ? true : false;
});

Template.registerHelper("gt", function (v1, v2, options) {
    return (v1 > v2) ? true : false;
});

Template.registerHelper("lte", function (v1, v2, options) {
    return (v1 <= v2) ? true : false;
});

Template.registerHelper("gte", function (v1, v2, options) {
    return (v1 >= v2) ? true : false;
});

Template.registerHelper("in", function (v1, v2, options) {
    if (typeof v1 === "string" && typeof v2 === "string") {
        var a = v1.toLowerCase();
        var b = v2.toLowerCase();
        return (a.indexOf(b) !== -1 || b.indexOf(a) !== -1) ? true : false;
    } else {
        return false;
    };
});

Template.registerHelper("OR", function (v1, v2, options) {
    return (v1 || v2) ? true : false;
});

Template.registerHelper("AND", function (v1, v2, options) {
    return (v1 && v2) ? true : false;
});
