const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
const Quality = mongoose.model('Qualitie');
const Finition = mongoose.model('Finition');
const Finitionc = mongoose.model('Finitionc');
const Type = mongoose.model('Type');
const BL = mongoose.model('Bl');

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
       // doc.products = [{name:"req.body.city", code:"dd"},{name:"req.body.city", code:"aa"}] ;
       doc.products.push({name:req.body.quality + ' ' + req.body.finition + ' ' + req.body.type, quantity:req.body.qte, long : req.body.long, larg : req.body.larg, epai : req.body.epai, uv: req.body.uv, idbl: doc._id})
       console.log('TABLE  : ' + doc.products);
       doc.save((err, doc2) => {
        if (!err)
       goToBlWithAllData(doc, res);
     
            else
                console.log('Error during record insertion : ' + err);
        });
});



}

function AddPrestation(req, res){
    console.log('XANA' + req.body.idpr + ' TT ' + req.body.idbl);

    BL.findById(req.body.idbl, (err, doc) => {
        
      // doc.products = [{name:"req.body.city", code:"dd"},{name:"req.body.city", code:"aa"}] ;
      for (i = 0; i < doc.products.length; i++){
        console.log('XAN!' + doc.products[i] + ' pp ' +  req.body.idpr);  
          if(req.body.idpr == doc.products[i]._id){
            console.log('XANAWA');
            doc.products[i].prestation.push({name: req.body.finitionc, surface:req.body.sl})
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

router.get('/list', (req, res) => {
    console.log('JUST WATCH ME');
    Bl.find((err, docs) => {
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

function goToBlWithAllData(bl, res){
    Quality.find((err, docs) => {
        if (!err) {
            Finition.find((err, docs2) => {
                if (!err) {
                    Type.find((err, docs3) => {
                        if (!err) {
                            Finitionc.find((err, docs4) => {
                                if (!err) {
                                    console.log('JOJO' + docs4);
                                    res.render("employee/Bl", {
                                        viewTitle: "Insert Employee",
                                        quality: docs,
                                        finition : docs2,
                                        type : docs3,
                                        bl:bl,
                                        finitionc: docs4,
                                        presbool:false
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
                                    console.log('JOJO' + docs4);
                                    res.render("employee/Bl", {
                                        viewTitle: "Insert Employee",
                                        quality: docs,
                                        finition : docs2,
                                        type : docs3,
                                        bl:bl,
                                        finitionc: docs4,
                                        idpr: id,
                                        presbool:true
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