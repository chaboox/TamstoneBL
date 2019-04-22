const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
const Quality = mongoose.model('Qualitie');
const Finition = mongoose.model('Finition');
const Finitionc = mongoose.model('Finitionc');
const Type = mongoose.model('Type');
const BL = mongoose.model('Bl');
const Client = mongoose.model('Client');

router.get('/', (req, res) => {

    
    Quality.find((err, docs) => {
        if (!err) {
            res.render("employee/addOrEdit", {
                viewTitle: "Insert Employee",
                quality: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });


  
});

router.post('/', (req, res) => {
    console.log('Yayo !: ' +req.body.product + ' kk ' + req.body.bl_id );
    if(req.body.product != '' && req.body.product != undefined)
        AddProduct(req, res);
    else
    if(req.body.bl_id != ''  && req.body.bl_id != undefined){
        console.log('Yayo 2!: ');
        createBl(req, res);
    }
    else
    
    if (req.body._id == ''  && req.body._id != undefined)
        insertRecord(req, res);
        else
        updateRecord(req, res);
});

router.post('/yo', (req, res) => {
    console.log('YOJA!: ');
    AddPrestation(req, res);
});

router.get('/BL', (req, res) => {
    Quality.find((err, docs) => {
        if (!err) {
            Finition.find((err, docs2) => {
                if (!err) {
                    Type.find((err, docs3) => {
                        if (!err) {
                            res.render("employee/Bl", {
                                viewTitle: "Insert Employee",
                                quality: docs,
                                finition : docs2,
                                type : docs3
                            });
                        }
                        else {
                            console.log('Error in retrieving employee list :' + err);
                        }
                    });
                }
                else {
                    console.log('Error in retrieving employee list :' + err);
                }
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
});

router.get('/home', (req, res) => {
    Employee.find((err, docs) => {
        if (!err) {
            res.render("employee/home", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
});

function insertRecord(req, res) {
    var employee = new Employee();
    employee.fullName = req.body.fullName;
    employee.email = req.body.email;
    employee.mobile = req.body.mobile;
    employee.city = [{name:req.body.city, code:"dd"},{name:req.body.city, code:"aa"}] ;
    employee.save((err, doc) => {
        if (!err)
            res.redirect('employee/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: "Insert Employee",
                    employee: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function createBl(req, res){
    var bl = new BL();
    bl.name = "test";
    bl.save((err, doc) => {

    if (!err)
    goToBlWithAllData(bl, res);
      

            else
            console.log('Error during record insertion : ' + err);
    });
}

function updateRecord(req, res) {
    Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('employee/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: 'Update Employee',
                    employee: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


function AddProduct(req, res){
    console.log('Yaya !: ' + req.body.product);
    BL.findById(req.body.product, (err, doc) => {
       console.log('Hey !: ' + req.body.finition);
       //TODO Calcul price

       var surface = calculSurfaceByType(req.body.uv, 1000*req.body.qte, 1000*req.body.long, 1000*req.body.larg, 1000*req.body.epai)
       var epais = numberWithCommas(req.body.epai);
       var largs = numberWithCommas(req.body.larg);
       var longs = numberWithCommas(req.body.long);
       var pus = numberWithCommas(req.body.pu);
       var prixs = numberWithCommas((surface * req.body.pu) + '');
       var surfaces = numberWithCommas(surface + '');
       console.log('Hey !: ' + surfaces + ' LOLO ' + surface);
      // surface = Math.floor(( surface )*10000)/10000;
       // doc.products = [{name:"req.body.city", code:"dd"},{name:"req.body.city", code:"aa"}] ;
       doc.products.push({name:req.body.quality + ' ' + req.body.finition + ' ' + req.body.type, quantity:req.body.qte, long : req.body.long,  longs : longs, larg : req.body.larg, largs : largs, epai : req.body.epai, epais : epais, uv: req.body.uv, idbl: doc._id, pu : req.body.pu, pus: pus, surface: surface, surfaces: surfaces, prixs: prixs, prix: surface * req.body.pu})
       console.log('TABLE  : ' + doc.products);
       doc.save((err, doc2) => {
        if (!err)
       goToBlWithAllData(doc, res);
     
            else
                console.log('Error during record insertion : ' + err);
        });
});



}

function calculSurfaceByType(type, qte, long, larg, epai){
    console.log('XANLEA' + type);
    if(type == "M2") return (qte * long * larg)/1000000000;
    else if(type == "ML") return (qte * long)/1000000;
    else if(type == "U") return qte/1000;
    else if(type == "M3") return (qte * long * larg * epai)/1000000000000;
    else if(type == "TN") return (qte * long * larg * epai * 28)/10000000000000;
    else return 0;
}

function AddPrestation(req, res){
    console.log('XANA' + req.body.idpr + ' TT ' + req.body.idbl);

    BL.findById(req.body.idbl, (err, doc) => {
        
      // doc.products = [{name:"req.body.city", code:"dd"},{name:"req.body.city", code:"aa"}] ;
      for (i = 0; i < doc.products.length; i++){
        console.log('XAN!' + doc.products[i] + ' pp ' +  req.body.idpr);  
          if(req.body.idpr == doc.products[i]._id){
            console.log('XANAWA');
            var surcafepr = calculeSurcace(doc.products[i], req.body.sl, req.body.pup);
            doc.products[i].prestation.push({name: req.body.finitionc, surface:req.body.sl, pu: req.body.pup, prix:surcafepr * req.body.pup, surfacer: surcafepr, surfacers: numberWithCommas(surcafepr + ''), prixs: numberWithCommas((surcafepr * req.body.pup) + ''), pus: numberWithCommas(req.body.pup)})
          }
      }
     
      console.log('XANA' + doc.products);
       //doc.products.push({name:req.body.quality + ' ' + req.body.finition + ' ' + req.body.type, quantity:req.body.qte, long : req.body.long, larg : req.body.larg, epai : req.body.epai, uv: req.body.uv, idbl: doc._id})
      // console.log('TABLE  : ' + doc.products);
      doc.save((err, doc2) => {
       if (!err)
       goToBlWithAllData(doc, res);
     //  goToBlWithAllData(doc, res);
     
            else
               console.log('Error during record insertion : ' + err);
        });
});

}

function calculeSurcace(product, sl, pu){
    switch(sl) {
        case 'S/1 LONG':
            return product.long * product.quantity;
        break;
        case 'S/1 LARG':
              return product.larg * product.quantity;
        break;
        
        case 'S/2 LONG':
          return product.long * product.quantity *2;
        break;

        case 'S/2 LARG':
            return product.larg * product.quantity *2;
        break;

        case 'S/2 LONG ET S/2LARG':
            return product.long * product.quantity *2 + product.larg * product.quantity *2;
        break;

        case 'S/1 LONG ET S/2LARG':
            return product.long * product.quantity  + product.larg * product.quantity *2;
        break;

        case 'S/2 LONG ET S/1LARG':
            return product.long * product.quantity *2 + product.larg * product.quantity;
        break;

        case 'S/1 LONG ET S/1LARG':
            return product.long * product.quantity + product.larg * product.quantity;
        break;

        default:
          return -1;
        break;
      }
}

router.get('/list', (req, res) => {
    console.log('JUST WATCH ME');
    Employee.find((err, docs) => {
        if (!err) {
            res.render("employee/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
});

router.get('/clients', (req, res) => {
    console.log('JUST WATCH ME');
    Client.find((err, docs) => {
        if (!err) {
            res.render("employee/clients", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
});

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

function numberWithCommas(x) {
    var left = '';
    var right = '';
    var leftBool = true;
    for (var i = 0; i < x.length; i++){
        if(x[i] == '.'){
        leftBool = false;
        i++;
        }
        if(leftBool)
            left = left + x[i];
            else
            right = right + x[i];
    }

    if (right.length == 0)
        right = '00';
    else if( right.length == 1)
        right = right + '0';
    
    left = left.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    console.log('JOJOJO' + x[1] + x.length); 
    //TODO ADAPTE NUMBER
    return left + '.' + right ;
}

function goToBlWithAllData(bl, res){
    Quality.find((err, docs) => {
        if (!err) {
            Finition.find((err, docs2) => {
                if (!err) {
                    Type.find((err, docs3) => {
                        if (!err) {
                            Finitionc.find((err, docs4) => {
                                if (!err) {
                                    //console.log('JOJO' + docs4);
                                    var prestations = getPrestation(bl.products);
                                    res.render("employee/Bl", {
                                        viewTitle: "Insert Employee",
                                        quality: docs,
                                        finition : docs2,
                                        type : docs3,
                                        bl:bl,
                                        finitionc: docs4,
                                        presbool:false,
                                        prestation: prestations
                                    });
                                }
                                else {
                                    console.log('Error in retrieving employee list :' + err);
                                }
                            });
                        }
                        else {
                            console.log('Error in retrieving employee list :' + err);
                        }
                    });
                }
                else {
                    console.log('Error in retrieving employee list :' + err);
                }
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
}

function goToBlWithAllDataAndId(bl, res, id){
    Quality.find((err, docs) => {
        if (!err) {
            Finition.find((err, docs2) => {
                if (!err) {
                    Type.find((err, docs3) => {
                        if (!err) {
                            Finitionc.find((err, docs4) => {
                                if (!err) {
                                    //console.log('JOJO' + docs4);
                                    var prestations = getPrestation(bl.products);
                                    res.render("employee/Bl", {
                                        viewTitle: "Insert Employee",
                                        quality: docs,
                                        finition : docs2,
                                        type : docs3,
                                        bl:bl,
                                        finitionc: docs4,
                                        idpr: id,
                                        presbool:true,
                                        prestation: prestations
                                    });
                                }
                                else {
                                    console.log('Error in retrieving employee list :' + err);
                                }
                            });
                        }
                        else {
                            console.log('Error in retrieving employee list :' + err);
                        }
                    });
                }
                else {
                    console.log('Error in retrieving employee list :' + err);
                }
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
}

function getPrestation(products){
    var result = [];
    console.log('OIOI' + products[0]);
   // if(bl != undefined)
   //if(bl.products != undefined)
   for (var i = 0; i < products.length; i++){
        console.log('OIOI2' + products[i]);
        for (var j = 0; j < products[i].prestation.length; j++){
            console.log('OIOI2' + products[i].prestation[j]);
            var isInResult = false;
            for (var k = 0; k < result.length; k++){
                console.log('JOKO   ' + products[i].prestation[j].name + " ||| "  + result[k].name + " |||| " + result[k].pu + products[i].prestation[j].pu);
                if(result[k].name == products[i].prestation[j].name && result[k].pu == products[i].prestation[j].pu){
                    console.log('JOKO!!!!   ' +  result[k].surfacer + " LL " + result[k].pu + "LL " + result[k].prix + isInResult + " KLKLKL " + products[i].prestation[j].surfacer);
                    console.log('LOLO' + result);
                    result[k].surfacer = result[k].surfacer*1 + products[i].prestation[j].surfacer*1;
                    result[k].surfacers = numberWithCommas(result[k].surfacer);
                   // var opp = result[k].surfacer*1 + products[i].prestation[j].surfacer*1;
                    result[k].prix = result[k].surfacer * result[k].pu;
                    result[k].prixs = numberWithCommas(result[k].prix);
                   // result[k].surfacer = opp;
                    isInResult = true;
                    //console.log('JOKO!!!!   ' +  result[k].surfacer + " LL " + result[k].pu + "LL " + result[k].prix + isInResult + "KLOLKLO " + opp);
                }
            }
           if(isInResult == false) 
                result.push(products[i].prestation[j]);
        }
   }
       // for(prestation in products){
        // result.push(prestation);   
        //}
    
    console.log('PRORO' + result);
    return result;
}

router.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) { 
            res.render("employee/addOrEdit", {
                viewTitle: "Update Employee",
                employee: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/employee/list');
        }
        else { console.log('Error in employee delete :' + err); }
    });
});

router.get('/deletepro/:id', (req, res) => {
    var newArray = [];
    var idBL =  req.params.id.substring(0, 24);
    var idPR = req.params.id.substring(25);
    BL.findById(idBL, (err, doc) => {
        if (!err) { 
           // res.redirect('/employee/list');
           for (var i = 0; i < doc.products.length; i++)
    if ( doc.products[i]._id == idPR) { 
        doc.products.splice(i, 1);
        break;
    }
    doc.save((err, doc) => {

        if (!err)
        goToBlWithAllData(doc, res);    
                else
                console.log('Error during record insertion : ' + err);
        });
        }
        else { console.log('Error in employee delete :' + err); }
    });
});

router.get('/addprestation/:id', (req, res) => {
    var idBL =  req.params.id.substring(0, 24);
    var idPR = req.params.id.substring(25);
    console.log('TEST ALPHA :' + req.params.id + ' kk ' + idPR);
    BL.findById(idBL, (err, doc) => {
        if (!err) {
            //res.redirect('/employee/list');
            goToBlWithAllDataAndId(doc, res, idPR);
        }
        else { console.log('Error in employee delete :' + err); }
    });
});
module.exports = router;