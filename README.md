# landgrabapp

Contracts are deployed on following addresses on BSC testnet:

✅ LandRegistry deployed to: 0x2Eb46f51954078b7937683E47EDe1Acb52465A99

✅ UserManager deployed to: 0xdb07aE2D1f8B66c2f2ccB1F1C7FFAbDFb31eD43c

Steps to deploy app:

1. npm i

2. npm start

User execution flow:

1. Click on Register User

2. Select Metanmask address to be connected and sign to connect to Dapp.

3. Click on register to register as a user.

4. Click on 'Claim Land' to see a successful message.

5. Click on 'View My Lands' to view list of all claimed lands.

6. Enter land w3w name in text box and click 'Release Land' to release land.

7. Enter owned land's w3w name, receiver's address and receiver owned w3w land name and click Swap to swap lands with another user.

8. Goto Settings-> Click 'Delete Account' to delete your user and all owned lands.

Note: Since w3w api is not working with free API key during development, 2 example w3words have been used on claimLand function

src/pages/ClaimLand.js

1. toddler.geologist.animated 

2. filled.count.soap






