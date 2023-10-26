# ChangeLog

## 0.0.1

* Release date: 2022-04-24

    - Initial code

## 0.0.2

* Release date: 2022-04-28

    - Logo change
    - Updated README.md including value added info.

## 0.0.3

* Release date: 2022-04-28

    - bugfix: tables padding was considered 0 when not set

## 0.0.4

* Release date: 2022-05-11

    - bugfix: tables trailing blanks were treated as not valid
    - bugfix: table lines with empty cells were not treated
    - bugfix: padding lines did not work when table padding was -1

## 1.0.0

* Release data: 2023-02-11

    - feature: extension works now as a formatter for .feature files
    - removed: the original ad-hoc menu entry in contextual menu

## 1.0.1

* Release data: 2023-02-24

    - feature: fixtureLineBreak setting inserts a line break before found @fixture tags

## 1.0.2

* Release data: 2023-07-09

    - bugfix: tables permit escaped | chars in their columns

## 1.0.3

* Release data: 2023-10-26

    - feature: normalize lines starting with keywords to leave exactly one blank just after it and before the rest of the line
    - feature: new setting for trimming several consecutive blank lines to one
    - bugfix: blank lines padding removed
