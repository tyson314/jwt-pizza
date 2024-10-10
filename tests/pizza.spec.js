import { test, expect } from 'playwright-test-coverage';

test('purchase with login', async ({ page }) => {
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
      { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    const franchiseRes = [
      {
        id: 2,
        name: 'LotaPizza',
        stores: [
          { id: 4, name: 'Lehi' },
          { id: 5, name: 'Springville' },
          { id: 6, name: 'American Fork' },
        ],
      },
      { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
      { id: 4, name: 'topSpot', stores: [] },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'd@jwt.com', password: 'a' };
    const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/order', async (route) => {
    const orderReq = {
      items: [
        { menuId: 1, description: 'Veggie', price: 0.0038 },
        { menuId: 2, description: 'Pepperoni', price: 0.0042 },
      ],
      storeId: '4',
      franchiseId: 2,
    };
    const orderRes = {
      order: {
        items: [
          { menuId: 1, description: 'Veggie', price: 0.0038 },
          { menuId: 2, description: 'Pepperoni', price: 0.0042 },
        ],
        storeId: '4',
        franchiseId: 2,
        id: 23,
      },
      jwt: 'eyJpYXQ',
    };
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(orderReq);
    await route.fulfill({ json: orderRes });
  });

  await page.goto('/');

  // Go to order page
  await page.getByRole('button', { name: 'Order now' }).click();

  // Create order
  await expect(page.locator('h2')).toContainText('Awesome is a click away');
  await page.getByRole('combobox').selectOption('4');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await expect(page.locator('form')).toContainText('Selected pizzas: 2');
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Login
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  // Pay
  await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
  await expect(page.locator('tbody')).toContainText('Veggie');
  await expect(page.locator('tbody')).toContainText('Pepperoni');
  await expect(page.locator('tfoot')).toContainText('0.008 ₿');
  await page.getByRole('button', { name: 'Pay now' }).click();

  // Check balance
  await expect(page.getByText('0.008')).toBeVisible();
});

test('about page', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  await page.getByRole('link', { name: 'About' }).click();
  await expect(page.getByText('The secret sauce')).toBeVisible();
  await expect(page.getByText('At JWT Pizza, our amazing')).toBeVisible();
  await expect(page.getByText('Our talented employees at JWT')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Our employees' })).toBeVisible();
  await expect(page.getByText('JWT Pizza is home to a team')).toBeVisible();
  await expect(page.getByText('JWT Pizza', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Global').getByRole('img')).toBeVisible();
  });

test('history page', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'History' }).click();
  await expect(page.getByText('Mama Rucci, my my')).toBeVisible();
  await expect(page.getByText('It all started in Mama Ricci\'')).toBeVisible();
  await expect(page.getByLabel('Global').getByRole('img')).toBeVisible();
  await expect(page.getByText('JWT Pizza', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'history', exact: true }).click();
  await expect(page.getByText('Mama Rucci, my my')).toBeVisible();
  await page.getByRole('link', { name: 'home' }).click();
  await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible(); 
});

test('diner dashboard', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'tyson@tyson', password: 'tyson' };
    const loginRes = { user: { id: 3, name: 'Tyson', email: 'tyson@tyson', roles: [{ role: 'diner' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/order', async (route) => {
    const orderRes = {
      "dinerId": 388,
      "orders": [
        {
          "id": 855,
          "franchiseId": 3,
          "storeId": 10,
          "date": "2024-10-08T18:20:33.000Z",
          "items": [
            {
              "id": 4337,
              "menuId": 4,
              "description": "Crusty",
              "price": 0.0024
            },
            {
              "id": 4338,
              "menuId": 2,
              "description": "Pepperoni",
              "price": 0.0042
            }
          ]
        }
      ],
      "page": 1
    }
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: orderRes });
  });

  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();

  
  await page.getByPlaceholder('Email address').fill('tyson@tyson');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('tyson');
  
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByText('The web\'s best pizza', { exact: true }).click();
  await expect(page.getByRole('link', { name: 'T', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Register' })).not.toBeVisible();
  await expect(page.getByRole('link', { name: 'Login' })).not.toBeVisible();
  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();


  await page.getByRole('link', { name: 'T', exact: true }).click();

  await page.locator('div').filter({ hasText: 'Your pizza kitchenname:' }).nth(2).click();
  await expect(page.getByRole('cell', { name: '855' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '₿' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '-10-08T18:20:33.000Z' })).toBeVisible();

  await expect(page.getByText('Tyson', { exact: true })).toBeVisible();
  await expect(page.getByText('tyson@tyson')).toBeVisible();
  await expect(page.getByText('diner', { exact: true })).toBeVisible();
});

test('admin dash create close franchise', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('admin@admin');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('admin');
  await page.getByPlaceholder('Password').press('Enter');
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByText('Mama Ricci\'s kitchen')).toBeVisible();
  // await expect(page.getByRole('cell', { name: '04yxt443bn' })).toBeVisible();
  // await expect(page.getByRole('cell', { name: 'zq8kr3d5n7' }).first()).toBeVisible();
  // await expect(page.getByRole('row', { name: '04yxt443bn zq8kr3d5n7 Close' }).getByRole('button')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add Franchise' })).toBeVisible();
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await expect(page.getByText('Create franchise', { exact: true })).toBeVisible();
  await expect(page.getByText('Want to create franchise?')).toBeVisible();
  await expect(page.getByPlaceholder('franchise name')).toBeVisible();

  await page.getByPlaceholder('franchise name').click();
  await page.getByPlaceholder('franchise name').fill('fortnite pizza');
  await page.getByPlaceholder('franchise name').press('Tab');
  await page.getByPlaceholder('franchisee admin email').fill('pizza@pizza');
  await page.getByRole('button', { name: 'Create' }).click();

  await page.getByRole('link', { name: 'Admin', exact: true }).click();
  await page.getByRole('row', { name: '0gbvbsli9t xuqtfs8y64 Close' }).getByRole('button').click();
  await expect(page.getByText('Sorry to see you go')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('row', { name: '0gbvbsli9t	xuqtfs8y64 Close' }).getByRole('button')).toBeVisible();
});

test('not found', async ({ page }) => {
  await page.goto('/asdfasdfasdf');

  await expect(page.getByText('Oops')).toBeVisible();
  await expect(page.getByText('It looks like we have dropped')).toBeVisible();
  await page.getByRole('link', { name: 'home' }).click();
  await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
});

test('register', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Register' }).click();
  await expect(page.getByText('Welcome to the party')).toBeVisible();
  await expect(page.getByPlaceholder('Full name')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
  await page.getByRole('main').getByText('Login').click();
  await expect(page.getByText('Welcome back')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await page.getByRole('main').getByText('Register').click();
  await expect(page.getByText('Welcome to the party')).toBeVisible();
  await page.getByPlaceholder('Full name').click();
  await page.getByPlaceholder('Full name').fill('Tyosn');
  await page.getByPlaceholder('Full name').press('Tab');
  await page.getByPlaceholder('Email address').fill('tyson');
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('tyson@tysonty');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('tyson');
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'T', exact: true })).toBeVisible();
});

test('logout', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    if (route.request().method() === 'PUT') {
      const loginReq = { email: 'admin@admin', password: 'admin' };
      const loginRes = {
        user: { id: 3, name: 'Kai Chen', email: 'admin@admin', roles: [{ role: 'admin' }] },
        token: 'abcdef'
      };
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    }
    if (route.request().method() === 'DELETE') {
      await route.fulfill({
        json:  {"message": "logout successful"}
      });
    }
  });

  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('admin@admin');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
  await page.getByRole('link', { name: 'Logout' }).click();

  await new Promise(resolve => setTimeout(resolve, 1000));

  await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
});

test('franchisee create store', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'franchisee@franchisee', password: 'franchisee' };
    const loginRes = { user: { id: 3, name: 'franchisee', email: 'franchisee@franchisee', roles: [{ role: 'franchisee' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/franchise/*', async (route) => {
    const franchiseRes = 
      [
        {
          "id": 200,
          "name": "558y8qr1a5",
          "admins": [
            {
              "id": 332,
              "name": "lpmcm93x0d",
              "email": "lpmcm93x0d@admin.com"
            },
            {
              "id": 365,
              "name": "franchisee",
              "email": "franchisee@franchisee"
            }
          ],
          "stores": [
            {
              "id": 17,
              "name": "lhlkjhlkjh",
              "totalRevenue": 0
            }
          ]
        }
      ]
      expect(route.request().method()).toBe('GET');
      await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/franchise/*/store', async (route) => {
    const storeReq = { name: "Pizza" }
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(storeReq);
    await route.fulfill({ json: storeReq });
  });

  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('franchisee@franchisee');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('franchisee');
  await page.getByRole('button', { name: 'Login' }).click();
  
  await new Promise(resolve => setTimeout(resolve, 1000));

  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await expect(page.getByText('558y8qr1a5')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create store' })).toBeVisible();
  await page.getByRole('button', { name: 'Create store' }).click();
  await expect(page.getByText('Create store')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByText('558y8qr1a5')).toBeVisible();
  await page.getByRole('button', { name: 'Create store' }).click();
  await expect(page.getByText('Create store')).toBeVisible();
  await page.getByPlaceholder('store name').click();
  await page.getByPlaceholder('store name').fill('Pizza');
  await page.getByRole('button', { name: 'Create' }).click();

  await new Promise(resolve => setTimeout(resolve, 1000));

  await expect(page.getByText('558y8qr1a5')).toBeVisible();
});