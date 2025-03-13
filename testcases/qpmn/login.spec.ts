import { test, expect } from '@playwright/test';
import { users } from './testdata';
import { LoginPage } from '../../pages/qpmn/login-page';
import { CatalogPage } from '../../pages/qpmn/catalog';

test('login - incorrect user name or password', async ({ page }) => {
    const loginpage = new LoginPage(page);
    await loginpage.open();
    
    await new LoginPage(page).loginFailed(users.useremail1, users.userpassword1)

  });

  test('login - empty password', async ({ page }) => {
    const loginpage = new LoginPage(page);
    await loginpage.open();
    
    await new LoginPage(page).loginWithoutPassword(users.useremail2, users.userpassword2)

  });

  test('login - normal login and logout', async ({ page }) => {
    const catalogpage = new CatalogPage(page);
    
    await catalogpage.open();
    await catalogpage.goToLoginPage();
    await new LoginPage(page).login(users.useremail3, users.userpassword3)

    const userIsLoggedIn = await catalogpage.userIsLoggedIn();
    expect(userIsLoggedIn).toBeTruthy();

    await catalogpage.signout();
    const userIsLoggedOut = await catalogpage.userIsLoggedOut();
    expect(userIsLoggedOut).toBeTruthy();

  });