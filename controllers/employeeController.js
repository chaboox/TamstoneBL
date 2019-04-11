const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
const Quality = mongoose.model('Qualitie');
const Finition = mongoose.model('Finition');
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
        console.log('Hey !: ' + doc);
      // doc.products = [{name:"req.body.city", code:"dd"},{name:"req.body.city", code:"aa"}] ;
       doc.products.push({name:req.body.quality + ' ' + req.body.finition + ' ' + req.body.type, quantity:req.body.qte, long : req.body.long, larg : req.body.larg, epai : req.body.epai, uv: req.body.uv})
       console.log('TABLE  : ' + doc.products);
       doc.save((err, doc2) => {
        if (!err)
       goToBlWithAllData(doc, res);
     
            else
                console.log('Error during record insertion : ' + err);
        });
});
}

router.get('/list', (req, res) => {
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
                            res.render("employee/Bl", {
                                viewTitle: "Insert Employee",
                                quality: docs,
                                finition : docs2,
                                type : docs3,
                                bl:bl
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

module.exports = router;