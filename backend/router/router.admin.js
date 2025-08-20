const express = require('express')
const router = express.Router()
const controllerAdmin = require('../controller/controller.admin')
const validatorApiKey = require('../apiKey/apikey')

router.use(validatorApiKey)

router.get('/',controllerAdmin.getAdmins)
router.get('/:id',controllerAdmin.getAdminById)
router.post('/',controllerAdmin.createAdmin)
router.put('/:id',controllerAdmin.updateAdmin)
router.delete('/:id',controllerAdmin.deleteAdmin)

module.exports=router
























