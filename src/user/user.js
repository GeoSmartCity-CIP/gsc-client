'use strict';

gsc.user = (function() {

    /**
     *
     * @exports gsc/user
     */
    var mod = {};

    /**
     * Register a new user
     *
     * @param {String} email - E-mail address that the user will be registerred with
     * @param {String} username - Username
     * @param {String} password - Password
     * @param {String} confirmpassword - Confirm password
     * @param {Object[]} organizations - A list of organizations that the user belongs to
     * @return {Promise.<Object>} - User response object
     */
    mod.register = function(email,
        username,
        password,
        confirmpassword,
        organizations) {

        return gsc.doPost('reguser', {
            email: email,
            username: username,
            password: password,
            confirmpassword: confirmpassword,
            organizations: organizations
        });

    };

    /**
     * Authenticate a user
     *
     * @param {string} username - Username
     * @param {string} password - Password
     * @return {Promise.<Response.<User>>} User response object
     */
    mod.login = function(username, password) {
        return gsc.doPost('login', {
            username: username,
            password: password
        });
    };

    /**
     * Delete a user
     *
     * @param {String} username - Username
     * @param {String} password - Password
     * @return {Promise.<Object>} - User response object
     */
    mod.delete = function(username, password) {
        return gsc.doPost('unreguser', {
            username: username,
            password: password
        });
    };

    /**
     * Get a password reminder
     * If both arguments are supplied, email takes presedent
     *
     * @param {string} [email=null] - E-mail of user to get reminder for
     * @param {string} [username=null] - Username of user to get reminder for
     * @return {Promise.<Object>} - User response object
     */
    mod.remindPassword = function(email, username) {

        var params = {};

        if (email !== undefined && email !== null) {
            params.email = email;
        } else if (username !== undefined && username !== null) {
            params.username = username;
        }

        return gsc.doPost('remindpwd', params);

    };

    /**
     * Change password for user
     *
     * @param {string} username - Username
     * @param {string} oldpassword - Old password
     * @param {string} newpassword - New password
     * @param {string} confirmnewpassword - Confirm new password
     * @return {Promise.<Object>} - User response object
     */
    mod.changePassword = function(username,
        oldpassword,
        newpassword,
        confirmnewpassword) {

        return gsc.doPost('changepwd', {
            username: username,
            oldpassword: oldpassword,
            newpassword: newpassword,
            confirmnewpassword: confirmnewpassword
        });

    };

    /**
     * Update user
     *
     * @param {number} userId - Identifier of user to update
     * @return {Promise.<Object>} - User response object
     */
    mod.update = function(userId, email, username, organizations) {

        return gsc.doPost('updateuser', {
            id: userId,
            email: email,
            username: username,
            organizations: organizations
        });

    };


    /**
     * List all users for a specific organization
     * 
     * @param {Number} organizationId - The numerical identifier of the organization for which users are to be retrieved
     * @returns {Promise.<Object>}
     */
    mod.list = function(organizationId) {
        return gsc.doPost('listuser', {
            idorganization: organizationId
        });
    };

    /**
     * Lock user
     *
     * @param {string} username - Username
     * @param {boolean} [lock=true] - Boolean flag to lock user
     * @return {Promise.<Object>}
     */
    mod.lock = function(username, lock) {

        if (lock === undefined) {
            lock = true;
        }

        return gsc.doPost('lockuser', {
            username: username,
            lock: lock
        });

    };

    /**
     * Verify registered email
     *
     * @param {Number} verificationId Id to confirm - sent to registerred email
     * @return {Promise.<Object>}
     */
    mod.verifyEmail = function(verificationId) {

        return gsc.doPost('verifymail', {
            id: verificationId
        });

    };

    /**
     * Creates a login form in a user-specified div using Bootstrap CSS classes.
     * The login form is linked to the GSC data catalogue back-end
     *
     * @param {String|jQuery} domNode - Either a jQuery node or an
     * CSS selector expression, i.e. #id or .class
     */
    mod.loginWidget = function(domNode) {
        var n = jQuery(domNode);
        n.append(
            '<div id="gscLoginForm">\
            <form>\
                <div class="form-group">\
                    <label for="usr">E-mail</label>\
                    <input id="usr" class="form-control" name="usr"\
                        type="text" placeholder="abc@def.com">\
                </div>\
                <div class="form-group">\
                    <label for="pwd">Password</label>\
                    <input id="pwd" class="form-control" name="pwd"\
                        type="password" placeholder="*****">\
                </div>\
                <button class="btn btn-primary" id="gscLoginBtn"\
                    type="submit">Login</button>\
            </form>\
        </div>');
        jQuery('#gscLoginForm button#gscLoginBtn').click(function(evt) {
            evt.preventDefault();
            console.log('Trying to log in');
            var usr = jQuery('#gscLoginForm input#usr').val();
            var pwd = jQuery('#gscLoginForm input#pwd').val();
            mod.login(usr, pwd).then(function(data) {
                console.log(data);
            });
        });
    };

    /**
     * Creates a user registration form in a user-specified div using Bootstrap CSS classes.
     * The login form is linked to the GSC data catalogue back-end
     *
     * @param {String|jQuery} domNode - Either a jQuery node or an
     * CSS selector expression, i.e. #id or .class
     */
    mod.registrationWidget = function(domNode) {
        var n = jQuery(domNode);
        n.append(
            '<div id="gscRegistrationForm">\
            <form>\
                <div class="form-group">\
                    <label for="email">E-mail</label>\
                    <input id="email" class="form-control" name="email"\
                        type="text" placeholder="name@organization.tld">\
                </div>\
                <div class="form-group">\
                    <label for="pwd">Password</label>\
                    <input id="pwd" class="form-control" name="pwd"\
                        type="password" placeholder="Enter password">\
                </div>\
                <div class="form-group">\
                    <label for="pwd2">Confirm password</label>\
                    <input id="pwd2" class="form-control" name="pwd2"\
                        type="password" placeholder="Confirm password">\
                </div>\
                <button class="btn btn-primary" id="gscRegisterBtn"\
                    type="submit">Register</button>\
            </form>\
        </div>');

        console.log('Try to register user');
        jQuery('#gscRegistrationForm button#gscRegisterBtn').click(function(evt) {
            evt.preventDefault();
            var email = jQuery('#gscRegistrationForm input#email').val();
            var pwd = jQuery('#gscRegistrationForm input#pwd').val();
            var pwd2 = jQuery('#gscRegistrationForm input#pwd2').val();
            mod.register(email, email, pwd, pwd2, [{
                    'organization': 666
                }]).then(function(data) {
                console.log(data);
            });
        });
    };

    return mod;

}());
