import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Order' }).click();
  await page.getByRole('combobox').selectOption('12');
  await page.getByRole('link', { name: 'Image Description Crusty A' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await page.getByText('Selected pizzas:').click();
  await page.getByRole('combobox').selectOption('10');
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('tyson@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('1234');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('main').getByText('Register').click();
  await page.getByPlaceholder('Full name').fill('Tyson');
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('tyson');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('tyson');
  await page.getByRole('button', { name: 'Register' }).click();
  await page.getByPlaceholder('Email address').fill('tyson@');
  await page.getByRole('button', { name: 'Register' }).click();
});