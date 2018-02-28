using SuperMap.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace ResDeal
{
    class Program
    {
        static void Main(string[] args)
        {
            Workspace ws = new Workspace();
            DatasourceConnectionInfo dci = new DatasourceConnectionInfo();
            dci.EngineType = EngineType.UDB;
            dci.Server = @"E:/GS/Data/SH.udb";
            dci.Alias = "SH";
            Datasource ds = ws.Datasources.Open(dci);
            //river(ds);
            //shg(ds);
            DP(ds);
        }
        static void river(Datasource ds)
        {
            //打开对应数据集
            Dataset dataset = ds.Datasets["riveRegion"];
            DatasetVector dv = dataset as DatasetVector;
            QueryParameter parameter = new QueryParameter();
            parameter.AttributeFilter = "1=1";
            Recordset rs = dv.Query(parameter);
            rs.MoveFirst();
            //打开数据文件
            string strRiverFile = @"E:\GS\文档\风险灾害\气象风险地理数据\riverflood.txt";
            StreamReader sr = new StreamReader(strRiverFile, Encoding.Default);
            String line;
            GeoRegion geo = null;
            Point2Ds p2ds = null;
            while ((line = sr.ReadLine()) != null)
            {
                line = line.Trim();
                line = System.Text.RegularExpressions.Regex.Replace(line, @"\s+", ",");
                if (line.StartsWith("POLYGON"))//新建一个面
                {
                    p2ds = new Point2Ds();
                }
                else if (line.Length>50)//结尾
                {
                    geo = new GeoRegion(p2ds);
                    rs.AddNew(geo);
                    string[] info = line.Split(',');
                    string name = info[0];
                    string type = info[1];
                    string datetime = info[2];
                    double level1_1h = double.Parse(info[3]);
                    double level1_3h = double.Parse(info[4]);
                    double level1_6h = double.Parse(info[5]);
                    double level1_24h = double.Parse(info[6]);
                    double level1_48h = double.Parse(info[7]);
                    double level1_72h = double.Parse(info[8]);
                    double level2_1h = double.Parse(info[9]);
                    double level2_3h = double.Parse(info[10]);
                    double level2_6h = double.Parse(info[11]);
                    double level2_24h = double.Parse(info[12]);
                    double level2_48h = double.Parse(info[13]);
                    double level2_72h = double.Parse(info[14]);
                    double level3_1h = double.Parse(info[15]);
                    double level3_3h = double.Parse(info[16]);
                    double level3_6h = double.Parse(info[17]);
                    double level3_24h = double.Parse(info[18]);
                    double level3_48h = double.Parse(info[19]);
                    double level3_72h = double.Parse(info[20]);
                    double level4_1h = double.Parse(info[21]);
                    double level4_3h = double.Parse(info[22]);
                    double level4_6h = double.Parse(info[23]);
                    double level4_24h = double.Parse(info[24]);
                    double level4_48h = double.Parse(info[25]);
                    double level4_72h = double.Parse(info[26]);

                    rs.SetFieldValue("Name", name);
                    rs.SetFieldValue("Type", type);
                    rs.SetFieldValue("UpdateTime", datetime);
                    rs.SetFieldValue("L1_H1", level1_1h);
                    rs.SetFieldValue("L1_H3", level1_3h);
                    rs.SetFieldValue("L1_H6", level1_6h);
                    rs.SetFieldValue("L1_H24", level1_24h);
                    rs.SetFieldValue("L1_H48", level1_48h);
                    rs.SetFieldValue("L1_H72", level1_72h);
                    rs.SetFieldValue("L2_H1", level2_1h);
                    rs.SetFieldValue("L2_H3", level2_3h);
                    rs.SetFieldValue("L2_H6", level2_6h);
                    rs.SetFieldValue("L2_H24", level2_24h);
                    rs.SetFieldValue("L2_H48", level2_48h);
                    rs.SetFieldValue("L2_H72", level2_72h);
                    rs.SetFieldValue("L3_H1", level3_1h);
                    rs.SetFieldValue("L3_H3", level3_3h);
                    rs.SetFieldValue("L3_H6", level3_6h);
                    rs.SetFieldValue("L3_H24", level3_24h);
                    rs.SetFieldValue("L3_H48", level3_48h);
                    rs.SetFieldValue("L3_H72", level3_72h);
                    rs.SetFieldValue("L4_H1", level4_1h);
                    rs.SetFieldValue("L4_H3", level4_3h);
                    rs.SetFieldValue("L4_H6", level4_6h);
                    rs.SetFieldValue("L4_H24", level4_24h);
                    rs.SetFieldValue("L4_H48", level4_48h);
                    rs.SetFieldValue("L4_H72", level4_72h);
                    rs.Update();
                }
                else
                {
                    string[] lonlat = line.Split(',');
                    double lon = double.Parse(lonlat[0]);
                    double lat = double.Parse(lonlat[1]);
                    Point2D p2d = new Point2D(lon,lat);
                    p2ds.Add(p2d);
                }
            }
            rs.Dispose();
        }
        static void shg(Datasource ds)
        {
            //打开对应数据集
            Dataset dataset = ds.Datasets["SHGRegion"];
            DatasetVector dv = dataset as DatasetVector;
            QueryParameter parameter = new QueryParameter();
            parameter.AttributeFilter = "1=1";
            Recordset rs = dv.Query(parameter);
            rs.MoveFirst();
            //打开数据文件
            string strRiverFile = @"E:\GS\文档\风险灾害\气象风险地理数据\flashflood.txt";
            StreamReader sr = new StreamReader(strRiverFile, Encoding.Default);
            String line;
            GeoRegion geo = null;
            Point2Ds p2ds = null;
            while ((line = sr.ReadLine()) != null)
            {
                line = line.Trim();
                line = System.Text.RegularExpressions.Regex.Replace(line, @"\s+", ",");
                if (line.StartsWith("POLYGON"))//新建一个面
                {
                    p2ds = new Point2Ds();
                }
                else if (line.Length > 50)//结尾
                {
                    geo = new GeoRegion(p2ds);
                    rs.AddNew(geo);
                    string[] info = line.Split(',');
                    string name = info[0];
                    string type = info[1];
                    string datetime = info[2];
                    double level1_1h = double.Parse(info[3]);
                    double level1_3h = double.Parse(info[4]);
                    double level1_6h = double.Parse(info[5]);
                    double level1_24h = double.Parse(info[6]);
                    double level2_1h = double.Parse(info[7]);
                    double level2_3h = double.Parse(info[8]);
                    double level2_6h = double.Parse(info[9]);
                    double level2_24h = double.Parse(info[10]);
                    double level3_1h = double.Parse(info[11]);
                    double level3_3h = double.Parse(info[12]);
                    double level3_6h = double.Parse(info[13]);
                    double level3_24h = double.Parse(info[14]);
                    double level4_1h = double.Parse(info[15]);
                    double level4_3h = double.Parse(info[16]);
                    double level4_6h = double.Parse(info[17]);
                    double level4_24h = double.Parse(info[18]);

                    rs.SetFieldValue("Name", name);
                    rs.SetFieldValue("Type", type);
                    rs.SetFieldValue("UpdateTime", datetime);
                    rs.SetFieldValue("L1_H1", level1_1h);
                    rs.SetFieldValue("L1_H3", level1_3h);
                    rs.SetFieldValue("L1_H6", level1_6h);
                    rs.SetFieldValue("L1_H24", level1_24h);
                    rs.SetFieldValue("L2_H1", level2_1h);
                    rs.SetFieldValue("L2_H3", level2_3h);
                    rs.SetFieldValue("L2_H6", level2_6h);
                    rs.SetFieldValue("L2_H24", level2_24h);
                    rs.SetFieldValue("L3_H1", level3_1h);
                    rs.SetFieldValue("L3_H3", level3_3h);
                    rs.SetFieldValue("L3_H6", level3_6h);
                    rs.SetFieldValue("L3_H24", level3_24h);
                    rs.SetFieldValue("L4_H1", level4_1h);
                    rs.SetFieldValue("L4_H3", level4_3h);
                    rs.SetFieldValue("L4_H6", level4_6h);
                    rs.SetFieldValue("L4_H24", level4_24h);
                    rs.Update();
                }
                else
                {
                    string[] lonlat = line.Split(',');
                    double lon = double.Parse(lonlat[0]);
                    double lat = double.Parse(lonlat[1]);
                    Point2D p2d = new Point2D(lon, lat);
                    p2ds.Add(p2d);
                }
            }
            rs.Dispose();
        }
        /// <summary>
        /// 隐患点
        /// </summary>
        /// <param name="ds"></param>
        static void DP(Datasource ds)
        {
            //打开对应数据集
            Dataset dataset = ds.Datasets["disasterPoint"];
            DatasetVector dv = dataset as DatasetVector;
            QueryParameter parameter = new QueryParameter();
            parameter.AttributeFilter = "1=1";
            Recordset rs = dv.Query(parameter);
            rs.MoveFirst();
            //打开数据文件
            string strRiverFile = @"E:\GS\文档\风险灾害\气象风险地理数据\geohazard.txt";
            StreamReader sr = new StreamReader(strRiverFile, Encoding.Default);
            String line;
            int index = 1;
            while ((line = sr.ReadLine()) != null)
            {
                line = System.Text.RegularExpressions.Regex.Replace(line, @"\s+", ",");
                if (index % 3 == 2)//新建点
                {
                    string[] lonlat = line.Split(',');
                    double lon = double.Parse(lonlat[0]);
                    double lat = double.Parse(lonlat[1]);
                    Point2D p2d = new Point2D(lon, lat);
                    GeoPoint gp = new GeoPoint(p2d);
                    rs.AddNew(gp);
                }
                if (index % 3 == 0)
                {
                    string[] info = line.Split(',');
                    string name = info[0];
                    string type = info[1];
                    string id = info[2];
                    double level1_1h = double.Parse(info[3]);
                    double level1_3h = double.Parse(info[4]);
                    double level1_6h = double.Parse(info[5]);
                    double level1_24h = double.Parse(info[6]);
                    double level2_1h = double.Parse(info[7]);
                    double level2_3h = double.Parse(info[8]);
                    double level2_6h = double.Parse(info[9]);
                    double level2_24h = double.Parse(info[10]);
                    double level3_1h = double.Parse(info[11]);
                    double level3_3h = double.Parse(info[12]);
                    double level3_6h = double.Parse(info[13]);
                    double level3_24h = double.Parse(info[14]);
                    double level4_1h = double.Parse(info[15]);
                    double level4_3h = double.Parse(info[16]);
                    double level4_6h = double.Parse(info[17]);
                    double level4_24h = double.Parse(info[18]);
                    rs.SetFieldValue("Name", name);
                    rs.SetFieldValue("Type", type);
                    rs.SetFieldValue("ID", id);
                    rs.SetFieldValue("L1_H1", level1_1h);
                    rs.SetFieldValue("L1_H3", level1_3h);
                    rs.SetFieldValue("L1_H6", level1_6h);
                    rs.SetFieldValue("L1_H24", level1_24h);
                    rs.SetFieldValue("L2_H1", level2_1h);
                    rs.SetFieldValue("L2_H3", level2_3h);
                    rs.SetFieldValue("L2_H6", level2_6h);
                    rs.SetFieldValue("L2_H24", level2_24h);
                    rs.SetFieldValue("L3_H1", level3_1h);
                    rs.SetFieldValue("L3_H3", level3_3h);
                    rs.SetFieldValue("L3_H6", level3_6h);
                    rs.SetFieldValue("L3_H24", level3_24h);
                    rs.SetFieldValue("L4_H1", level4_1h);
                    rs.SetFieldValue("L4_H3", level4_3h);
                    rs.SetFieldValue("L4_H6", level4_6h);
                    rs.SetFieldValue("L4_H24", level4_24h);
                    rs.Update();
                }
                index++;
            }
            rs.Dispose();
        }
    }
}
