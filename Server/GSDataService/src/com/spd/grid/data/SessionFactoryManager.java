package com.spd.grid.data;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

public class SessionFactoryManager {
    
    private static SqlSessionFactory _sqlSessionFactory;
    static {
        SqlSessionFactoryBuilder ssfb = new SqlSessionFactoryBuilder();
        _sqlSessionFactory = ssfb.build(SessionFactoryManager.class.getClassLoader()
                .getResourceAsStream("mybatis.xml"));

    }

    public static SqlSessionFactory getSSF() {
        return _sqlSessionFactory;
    }

    public static SqlSession openSession() {
        return getSSF().openSession();
    }
}