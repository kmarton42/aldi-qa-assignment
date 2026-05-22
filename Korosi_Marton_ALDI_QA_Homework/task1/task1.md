# 1. Task 1: Manual Testing

## 1.1. Test Cases

### Test Case 1: Add a single product to the shopping cart/list as a guest user

```gherkin
GIVEN I am on the storefront page
AND I am not logged in
WHEN I click the "+ Add" button for a specific product
THEN the button changes to show 1 product as the selected quantity
AND the counter next to the shopping cart/list icon is changed to 1
```

### Test Case 2: Add product while internet connection is lost

```gherkin
GIVEN I am on the ALDI storefront page
AND my internet connection is unavailable
WHEN I click the "+ Add" button for a specific product
THEN an error message is displayed saying:
"Connection lost, please check internet connection"
```

### Test Case 3: Verify shopping cart/list counter is updated after removing one product

```gherkin
GIVEN I am on the storefront page
AND I am not logged in
AND I have added two different products to the shopping cart/list
WHEN I remove one of the added products
THEN the counter next to the shopping cart/list icon is changed to 1
```

## 1.2. Necessary bug report fields

- ID
- title
- Short description
- Steps to reproduce
- Environment
- Browser type and version
- Affected feature
- Priority
- Severity
- Actual result
- Expected result

## 1.2. Necessary bug report fields

- Test Case ID
- Test Case Title
- Feature
- Preconditions
- Test Steps (GIVEN / WHEN / THEN)

## 1.4. Sample bug report

**ID:** BUG-001  
**Title:** Shopping list counter is not updated after adding a product  
**Short description:** After adding a product to the shopping list, the product appears as selected, but the shopping list counter remains 0.  
**Steps to reproduce:**
1. Open new.aldi.us
2. Select a product
3. Click "+ Add"
4. Check the shopping list counter

**Environment:** Windows 11, Chrome latest  
**Browser:** Chrome  
**Affected feature:** Add to Shopping List  
**Priority:** Medium  
**Severity:** Medium  
**Actual result:** Product is selected, but the counter remains 0.  
**Expected result:** The counter should be updated to 1.