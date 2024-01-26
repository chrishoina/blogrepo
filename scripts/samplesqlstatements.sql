-- Select and Order By statement.

select ename, dname, job, empno, hiredate, loc   
from emp, dept   
where emp.deptno = dept.deptno   
order by ename;

-- Select Count and Order By statement.
  
select dname, count(*) count_of_employees 
from dept, emp 
where dept.deptno = emp.deptno 
group by DNAME 
order by 2 desc;

