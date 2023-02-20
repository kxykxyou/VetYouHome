# VetYouHome
https://vetyouhome.online

A health care system web app which focuses on improving pet record and order work experience for vets and animal hospital.



The main idea of this project is from clinical vets needs.
For the last 10 years, some animal hostpital still use old-fasion UI with low resolution application and bad UX for pet record/order work. That system was not well designed for modern/digital workflow which causes low work efficiency for clinical vets.
In veterinary practice, vets should have a more convenient application to speed up their routine work.

## Table of Contents
- [Pain Points And Solution](#pain-points-and-solution)
- [How to use it](#how-to-use-it)
- [Features And Demos](#features-and-demos)
  - [Calling patient and double views for inpecting records and orders](#calling-patient-and-double-views-for-inpecting-records-and-orders)
  - [Search hitorical records and orders](#search-hitorical-records-and-orders)
  - [Generate record and autocomplete services name](#generate-record-and-autocomplete-services-name)
  - [Rapid add-in from historical orders](#rapid-add-in-from-historical-orders)
  - [Inpatient operations](#inpatient-operations)
- [System Architecture And Tech Stack](#system-architecture-and-tech-stack)
- [Table Schema](#table-schema)
- [Acknowledgement](#acknowledgement)

## Pain Points And Solution
> All the pain points are proposed and discussed by clinical vets and the author through needs interview
1. Vets are hard to trace a pet's hitorical records and their corresponding orders which are split saved in differenct databases(not related).
    - ***Store records and orders in related database and double views for inspecting hitorical records/orders.***
2. Vets make exam/medication/treatment reocrds with no name hint which means they have to remember what services the hospital supplies and even typo easily.
    - ***Text autocomplete from existing services.***
3. Vets input similar orders again and again.
    - ***Rapid add-in from historical orders.***

## How to use it
- URL: https://vetyouhome.online
- Recommended screen size: greater than 24 inches
- Recommended resolution: width > 1200px
- Loggin test account as a vet, and you can follow the features and demos below
```
Test account
account: 0900000000
password: test
```
- **All pet-concerned data like waiting pets, records, orders, inpatients will be reset on *every o'clock*.**

## Features And Demos

### Calling patient and double views for inpecting records and orders
<img src="http://g.recordit.co/ehmUlyj5Go.gif">

### Search hitorical records and orders
<img src="http://g.recordit.co/6eD1Gl4O62.gif">

### Generate record and autocomplete services name
<img src="http://g.recordit.co/BbCxf5cN5l.gif">

### Rapid add-in from historical orders
<img src="http://g.recordit.co/7ZAQvu2h6B.gif">

### Inpatient operations
- checking today's order
- switch inpatient cages
- discharge
<img src="http://g.recordit.co/jG4ihUSmz3.gif">


## System Architecture and Tech Stack
<img width="1080" alt="Screen Shot 2023-01-31 at 5 30 33 PM" src="https://user-images.githubusercontent.com/80204522/215721800-979310db-0c79-43e4-b78c-0dd95413356c.png">

- Backend: Node.js, Express, MySQL, Redis, Crontab
- Frontend: HTML, Bootstrap, JQuery, JsGrid
- Could Services(AWS): EC2, RDS, ElastiCache
- Database: MySQL, Redis
- Version Control: Git/GitHub
- Scheduler: Crontab

## Table Schema
<img width="1206" alt="Screen Shot 2023-01-31 at 3 26 12 PM" src="https://user-images.githubusercontent.com/80204522/215693906-2f174654-8114-4a7f-ab45-db0938a6d6bd.png">

## Acknowledgement
Thanks Ever Green Animal Hospital and vets, including Wei Chien(簡薇), Chi-Chun Wang(王麒鈞), Zhan-Hua Chang(張展華) for the needs interview. Every vets should be treated more well and wish you guys can have nicer record work experience as soon.
