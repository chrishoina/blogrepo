-- This works, with User data uploaded succesfully 
CREATE TABLE ORDSREACT.USERS 
    ( 
     ID       RAW (32) DEFAULT SYS_GUID() , 
     NAME     VARCHAR2 (255)  NOT NULL , 
     EMAIL    VARCHAR2 (255)  NOT NULL , 
     PASSWORD VARCHAR2 (255)  NOT NULL 
    ) 
    TABLESPACE DATA 
    LOGGING 
;

CREATE UNIQUE INDEX ORDSREACT.USERS_PK ON ORDSREACT.USERS 
    ( 
     ID ASC 
    ) 
    TABLESPACE DATA 
    LOGGING 
;

CREATE UNIQUE INDEX ORDSREACT.USERS_UK_1 ON ORDSREACT.USERS 
    ( 
     EMAIL ASC 
    ) 
    TABLESPACE DATA 
    LOGGING 
;

ALTER TABLE ORDSREACT.USERS 
    ADD CONSTRAINT USERS_PK PRIMARY KEY ( ID ) 
    USING INDEX ORDSREACT.USERS_PK ;

ALTER TABLE ORDSREACT.USERS 
    ADD CONSTRAINT NEW_UK_1 UNIQUE ( EMAIL ) 
    USING INDEX ORDSREACT.NEW_UK_1 ;

CREATE TABLE ORDSREACT.CUSTOMERS 
( 
    ID        RAW (32) DEFAULT SYS_GUID() , 
    NAME      VARCHAR2 (255)  NOT NULL , 
    EMAIL     VARCHAR2 (255)  NOT NULL , 
    IMAGE_URL VARCHAR2 (500)  NOT NULL 
) 
TABLESPACE DATA 
LOGGING 
;


CREATE UNIQUE INDEX ORDSREACT.CUSTOMERS_PK ON ORDSREACT.CUSTOMERS 
    ( 
     ID ASC 
    ) 
    TABLESPACE DATA 
    LOGGING 
;

ALTER TABLE ORDSREACT.CUSTOMERS 
    ADD CONSTRAINT CUSTOMERS_PK PRIMARY KEY ( ID ) 
    USING INDEX ORDSREACT.CUSTOMERS_PK ;

CREATE TABLE ORDSREACT.INVOICES 
    ( 
     ID           RAW (32) DEFAULT SYS_GUID() , 
     CUSTOMER_ID  VARCHAR2 (255)  NOT NULL , 
     AMOUNT       NUMBER (10)  NOT NULL , 
     STATUS       VARCHAR2 (255)  NOT NULL , 
     INVOICE_DATE DATE  NOT NULL 
    ) 
    TABLESPACE DATA 
    LOGGING 
;

CREATE UNIQUE INDEX ORDSREACT.INVOICES_PK ON ORDSREACT.INVOICES 
    ( 
     ID ASC 
    ) 
    TABLESPACE DATA 
    LOGGING 
;

ALTER TABLE ORDSREACT.INVOICES 
    ADD CONSTRAINT INVOICES_PK PRIMARY KEY ( ID ) 
    USING INDEX ORDSREACT.INVOICES_PK ;