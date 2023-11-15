/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
$(document).ready(function() {

    $(".click-title").mouseenter( function(    e){
        e.preventDefault();
        this.style.cursor="pointer";
    });
    $(".click-title").mousedown( function(event){
        event.preventDefault();
    });

    // Ugly code while this script is shared among several pages
    try{
        refreshHitsPerSecond(true);
    } catch(e){}
    try{
        refreshResponseTimeOverTime(true);
    } catch(e){}
    try{
        refreshResponseTimePercentiles();
    } catch(e){}
});


var responseTimePercentilesInfos = {
        data: {"result": {"minY": 1774.0, "minX": 0.0, "maxY": 14996.0, "series": [{"data": [[0.0, 1774.0], [0.1, 1774.0], [0.2, 1774.0], [0.3, 1776.0], [0.4, 1776.0], [0.5, 1776.0], [0.6, 1776.0], [0.7, 1776.0], [0.8, 1777.0], [0.9, 1777.0], [1.0, 1777.0], [1.1, 1777.0], [1.2, 1777.0], [1.3, 1777.0], [1.4, 1777.0], [1.5, 1777.0], [1.6, 1777.0], [1.7, 1777.0], [1.8, 1777.0], [1.9, 1777.0], [2.0, 1777.0], [2.1, 1778.0], [2.2, 1778.0], [2.3, 1778.0], [2.4, 1778.0], [2.5, 1778.0], [2.6, 1778.0], [2.7, 1778.0], [2.8, 1778.0], [2.9, 1778.0], [3.0, 1778.0], [3.1, 1778.0], [3.2, 1778.0], [3.3, 1778.0], [3.4, 1778.0], [3.5, 1778.0], [3.6, 1778.0], [3.7, 1778.0], [3.8, 1778.0], [3.9, 1778.0], [4.0, 1779.0], [4.1, 1779.0], [4.2, 1779.0], [4.3, 1779.0], [4.4, 1779.0], [4.5, 1779.0], [4.6, 1779.0], [4.7, 1779.0], [4.8, 1779.0], [4.9, 1779.0], [5.0, 1780.0], [5.1, 1780.0], [5.2, 1780.0], [5.3, 1780.0], [5.4, 1780.0], [5.5, 1780.0], [5.6, 1780.0], [5.7, 1780.0], [5.8, 1780.0], [5.9, 1780.0], [6.0, 1780.0], [6.1, 1780.0], [6.2, 1780.0], [6.3, 1780.0], [6.4, 1780.0], [6.5, 1780.0], [6.6, 1780.0], [6.7, 1781.0], [6.8, 1781.0], [6.9, 1781.0], [7.0, 1781.0], [7.1, 1781.0], [7.2, 1781.0], [7.3, 1781.0], [7.4, 1781.0], [7.5, 1781.0], [7.6, 1781.0], [7.7, 1781.0], [7.8, 1781.0], [7.9, 1781.0], [8.0, 1781.0], [8.1, 1781.0], [8.2, 1782.0], [8.3, 1782.0], [8.4, 1782.0], [8.5, 1782.0], [8.6, 1782.0], [8.7, 1782.0], [8.8, 1782.0], [8.9, 1782.0], [9.0, 1782.0], [9.1, 1782.0], [9.2, 1782.0], [9.3, 1782.0], [9.4, 1782.0], [9.5, 1782.0], [9.6, 1782.0], [9.7, 1782.0], [9.8, 1782.0], [9.9, 1782.0], [10.0, 1783.0], [10.1, 1783.0], [10.2, 1783.0], [10.3, 1783.0], [10.4, 1783.0], [10.5, 1783.0], [10.6, 1783.0], [10.7, 1783.0], [10.8, 1783.0], [10.9, 1783.0], [11.0, 1783.0], [11.1, 1783.0], [11.2, 1783.0], [11.3, 1783.0], [11.4, 1783.0], [11.5, 1783.0], [11.6, 1784.0], [11.7, 1784.0], [11.8, 1784.0], [11.9, 1784.0], [12.0, 1784.0], [12.1, 1784.0], [12.2, 1784.0], [12.3, 1784.0], [12.4, 1784.0], [12.5, 1784.0], [12.6, 1784.0], [12.7, 1784.0], [12.8, 1784.0], [12.9, 1784.0], [13.0, 1784.0], [13.1, 1784.0], [13.2, 1784.0], [13.3, 1784.0], [13.4, 1784.0], [13.5, 1784.0], [13.6, 1784.0], [13.7, 1784.0], [13.8, 1784.0], [13.9, 1784.0], [14.0, 1784.0], [14.1, 1784.0], [14.2, 1784.0], [14.3, 1784.0], [14.4, 1785.0], [14.5, 1785.0], [14.6, 1785.0], [14.7, 1785.0], [14.8, 1785.0], [14.9, 1785.0], [15.0, 1785.0], [15.1, 1785.0], [15.2, 1785.0], [15.3, 1785.0], [15.4, 1785.0], [15.5, 1785.0], [15.6, 1785.0], [15.7, 1785.0], [15.8, 1785.0], [15.9, 1785.0], [16.0, 1785.0], [16.1, 1785.0], [16.2, 1786.0], [16.3, 1786.0], [16.4, 1786.0], [16.5, 1786.0], [16.6, 1786.0], [16.7, 1786.0], [16.8, 1786.0], [16.9, 1786.0], [17.0, 1786.0], [17.1, 1787.0], [17.2, 1787.0], [17.3, 1787.0], [17.4, 1787.0], [17.5, 1787.0], [17.6, 1787.0], [17.7, 1787.0], [17.8, 1787.0], [17.9, 1787.0], [18.0, 1788.0], [18.1, 1788.0], [18.2, 1788.0], [18.3, 1788.0], [18.4, 1788.0], [18.5, 1788.0], [18.6, 1788.0], [18.7, 1788.0], [18.8, 1788.0], [18.9, 1788.0], [19.0, 1788.0], [19.1, 1789.0], [19.2, 1789.0], [19.3, 1789.0], [19.4, 1789.0], [19.5, 1789.0], [19.6, 1789.0], [19.7, 1789.0], [19.8, 1789.0], [19.9, 1790.0], [20.0, 1790.0], [20.1, 1790.0], [20.2, 1790.0], [20.3, 1790.0], [20.4, 1790.0], [20.5, 1790.0], [20.6, 1790.0], [20.7, 1790.0], [20.8, 1790.0], [20.9, 1791.0], [21.0, 1791.0], [21.1, 1791.0], [21.2, 1791.0], [21.3, 1791.0], [21.4, 1791.0], [21.5, 1791.0], [21.6, 1791.0], [21.7, 1791.0], [21.8, 1791.0], [21.9, 1791.0], [22.0, 1791.0], [22.1, 1791.0], [22.2, 1791.0], [22.3, 1792.0], [22.4, 1792.0], [22.5, 1792.0], [22.6, 1792.0], [22.7, 1792.0], [22.8, 1792.0], [22.9, 1792.0], [23.0, 1792.0], [23.1, 1792.0], [23.2, 1792.0], [23.3, 1792.0], [23.4, 1792.0], [23.5, 1792.0], [23.6, 1792.0], [23.7, 1792.0], [23.8, 1792.0], [23.9, 1793.0], [24.0, 1793.0], [24.1, 1793.0], [24.2, 1793.0], [24.3, 1793.0], [24.4, 1793.0], [24.5, 1793.0], [24.6, 1793.0], [24.7, 1794.0], [24.8, 1794.0], [24.9, 1794.0], [25.0, 1794.0], [25.1, 1794.0], [25.2, 1794.0], [25.3, 1794.0], [25.4, 1794.0], [25.5, 1795.0], [25.6, 1795.0], [25.7, 1795.0], [25.8, 1795.0], [25.9, 1795.0], [26.0, 1795.0], [26.1, 1795.0], [26.2, 1795.0], [26.3, 1795.0], [26.4, 1795.0], [26.5, 1795.0], [26.6, 1795.0], [26.7, 1795.0], [26.8, 1795.0], [26.9, 1796.0], [27.0, 1796.0], [27.1, 1796.0], [27.2, 1796.0], [27.3, 1796.0], [27.4, 1796.0], [27.5, 1796.0], [27.6, 1796.0], [27.7, 1796.0], [27.8, 1796.0], [27.9, 1796.0], [28.0, 1796.0], [28.1, 1796.0], [28.2, 1796.0], [28.3, 1796.0], [28.4, 1796.0], [28.5, 1796.0], [28.6, 1797.0], [28.7, 1797.0], [28.8, 1797.0], [28.9, 1797.0], [29.0, 1797.0], [29.1, 1797.0], [29.2, 1797.0], [29.3, 1797.0], [29.4, 1797.0], [29.5, 1797.0], [29.6, 1797.0], [29.7, 1797.0], [29.8, 1797.0], [29.9, 1797.0], [30.0, 1797.0], [30.1, 1797.0], [30.2, 1798.0], [30.3, 1798.0], [30.4, 1798.0], [30.5, 1798.0], [30.6, 1798.0], [30.7, 1798.0], [30.8, 1798.0], [30.9, 1798.0], [31.0, 1798.0], [31.1, 1798.0], [31.2, 1798.0], [31.3, 1798.0], [31.4, 1798.0], [31.5, 1798.0], [31.6, 1798.0], [31.7, 1798.0], [31.8, 1798.0], [31.9, 1798.0], [32.0, 1798.0], [32.1, 1798.0], [32.2, 1798.0], [32.3, 1798.0], [32.4, 1798.0], [32.5, 1799.0], [32.6, 1799.0], [32.7, 1799.0], [32.8, 1799.0], [32.9, 1799.0], [33.0, 1799.0], [33.1, 1799.0], [33.2, 1800.0], [33.3, 1800.0], [33.4, 1800.0], [33.5, 1800.0], [33.6, 1800.0], [33.7, 1801.0], [33.8, 1801.0], [33.9, 1801.0], [34.0, 1801.0], [34.1, 1801.0], [34.2, 1802.0], [34.3, 1802.0], [34.4, 1802.0], [34.5, 1802.0], [34.6, 1802.0], [34.7, 1802.0], [34.8, 1802.0], [34.9, 1802.0], [35.0, 1802.0], [35.1, 1802.0], [35.2, 1802.0], [35.3, 1802.0], [35.4, 1803.0], [35.5, 1803.0], [35.6, 1803.0], [35.7, 1803.0], [35.8, 1803.0], [35.9, 1803.0], [36.0, 1804.0], [36.1, 1804.0], [36.2, 1804.0], [36.3, 1804.0], [36.4, 1807.0], [36.5, 1809.0], [36.6, 1812.0], [36.7, 1812.0], [36.8, 1825.0], [36.9, 1827.0], [37.0, 1835.0], [37.1, 1835.0], [37.2, 1866.0], [37.3, 1884.0], [37.4, 1898.0], [37.5, 1979.0], [37.6, 1979.0], [37.7, 1982.0], [37.8, 1998.0], [37.9, 2030.0], [38.0, 2036.0], [38.1, 2036.0], [38.2, 2090.0], [38.3, 2095.0], [38.4, 2120.0], [38.5, 2120.0], [38.6, 2143.0], [38.7, 2161.0], [38.8, 2172.0], [38.9, 2201.0], [39.0, 2201.0], [39.1, 2211.0], [39.2, 2252.0], [39.3, 2264.0], [39.4, 2276.0], [39.5, 2276.0], [39.6, 2292.0], [39.7, 2301.0], [39.8, 2311.0], [39.9, 2364.0], [40.0, 2364.0], [40.1, 2368.0], [40.2, 2373.0], [40.3, 2375.0], [40.4, 2375.0], [40.5, 2380.0], [40.6, 2392.0], [40.7, 2392.0], [40.8, 2403.0], [40.9, 2403.0], [41.0, 2409.0], [41.1, 2409.0], [41.2, 2411.0], [41.3, 2417.0], [41.4, 2417.0], [41.5, 2418.0], [41.6, 2425.0], [41.7, 2425.0], [41.8, 2425.0], [41.9, 2445.0], [42.0, 2445.0], [42.1, 2451.0], [42.2, 2458.0], [42.3, 2458.0], [42.4, 2461.0], [42.5, 2466.0], [42.6, 2478.0], [42.7, 2510.0], [42.8, 2510.0], [42.9, 2513.0], [43.0, 2517.0], [43.1, 2540.0], [43.2, 2540.0], [43.3, 2543.0], [43.4, 2547.0], [43.5, 2555.0], [43.6, 2557.0], [43.7, 2557.0], [43.8, 2559.0], [43.9, 2566.0], [44.0, 2577.0], [44.1, 2588.0], [44.2, 2588.0], [44.3, 2601.0], [44.4, 2613.0], [44.5, 2617.0], [44.6, 2631.0], [44.7, 2631.0], [44.8, 2632.0], [44.9, 2632.0], [45.0, 2664.0], [45.1, 2664.0], [45.2, 2689.0], [45.3, 2693.0], [45.4, 2718.0], [45.5, 2730.0], [45.6, 2730.0], [45.7, 2735.0], [45.8, 2737.0], [45.9, 2749.0], [46.0, 2752.0], [46.1, 2752.0], [46.2, 2756.0], [46.3, 2763.0], [46.4, 2770.0], [46.5, 2770.0], [46.6, 2794.0], [46.7, 2846.0], [46.8, 2850.0], [46.9, 2852.0], [47.0, 2852.0], [47.1, 2856.0], [47.2, 2874.0], [47.3, 2948.0], [47.4, 2982.0], [47.5, 2982.0], [47.6, 2988.0], [47.7, 3004.0], [47.8, 3007.0], [47.9, 3007.0], [48.0, 3034.0], [48.1, 3040.0], [48.2, 3041.0], [48.3, 3046.0], [48.4, 3046.0], [48.5, 3049.0], [48.6, 3056.0], [48.7, 3072.0], [48.8, 3097.0], [48.9, 3097.0], [49.0, 3138.0], [49.1, 3149.0], [49.2, 3159.0], [49.3, 3159.0], [49.4, 3160.0], [49.5, 3187.0], [49.6, 3191.0], [49.7, 3200.0], [49.8, 3200.0], [49.9, 3219.0], [50.0, 3225.0], [50.1, 3234.0], [50.2, 3255.0], [50.3, 3255.0], [50.4, 3258.0], [50.5, 3263.0], [50.6, 3266.0], [50.7, 3270.0], [50.8, 3270.0], [50.9, 3275.0], [51.0, 3287.0], [51.1, 3292.0], [51.2, 3292.0], [51.3, 3294.0], [51.4, 3383.0], [51.5, 3394.0], [51.6, 3421.0], [51.7, 3421.0], [51.8, 3446.0], [51.9, 3481.0], [52.0, 3483.0], [52.1, 3487.0], [52.2, 3487.0], [52.3, 3501.0], [52.4, 3523.0], [52.5, 3543.0], [52.6, 3543.0], [52.7, 3544.0], [52.8, 3554.0], [52.9, 3573.0], [53.0, 3575.0], [53.1, 3575.0], [53.2, 3577.0], [53.3, 3599.0], [53.4, 3619.0], [53.5, 3649.0], [53.6, 3649.0], [53.7, 3684.0], [53.8, 3685.0], [53.9, 3704.0], [54.0, 3704.0], [54.1, 3748.0], [54.2, 3788.0], [54.3, 3832.0], [54.4, 3836.0], [54.5, 3836.0], [54.6, 3845.0], [54.7, 3849.0], [54.8, 3853.0], [54.9, 3866.0], [55.0, 3866.0], [55.1, 3886.0], [55.2, 3898.0], [55.3, 3955.0], [55.4, 3955.0], [55.5, 3977.0], [55.6, 3997.0], [55.7, 4003.0], [55.8, 4005.0], [55.9, 4005.0], [56.0, 4016.0], [56.1, 4048.0], [56.2, 4049.0], [56.3, 4073.0], [56.4, 4073.0], [56.5, 4078.0], [56.6, 4087.0], [56.7, 4093.0], [56.8, 4101.0], [56.9, 4101.0], [57.0, 4103.0], [57.1, 4123.0], [57.2, 4125.0], [57.3, 4125.0], [57.4, 4148.0], [57.5, 4153.0], [57.6, 4170.0], [57.7, 4183.0], [57.8, 4183.0], [57.9, 4190.0], [58.0, 4193.0], [58.1, 4194.0], [58.2, 4220.0], [58.3, 4220.0], [58.4, 4248.0], [58.5, 4289.0], [58.6, 4323.0], [58.7, 4323.0], [58.8, 4330.0], [58.9, 4333.0], [59.0, 4341.0], [59.1, 4358.0], [59.2, 4358.0], [59.3, 4375.0], [59.4, 4377.0], [59.5, 4386.0], [59.6, 4391.0], [59.7, 4391.0], [59.8, 4400.0], [59.9, 4413.0], [60.0, 4428.0], [60.1, 4428.0], [60.2, 4428.0], [60.3, 4445.0], [60.4, 4459.0], [60.5, 4461.0], [60.6, 4461.0], [60.7, 4475.0], [60.8, 4480.0], [60.9, 4496.0], [61.0, 4498.0], [61.1, 4498.0], [61.2, 4500.0], [61.3, 4510.0], [61.4, 4583.0], [61.5, 4585.0], [61.6, 4585.0], [61.7, 4598.0], [61.8, 4622.0], [61.9, 4655.0], [62.0, 4655.0], [62.1, 4659.0], [62.2, 4673.0], [62.3, 4675.0], [62.4, 4676.0], [62.5, 4676.0], [62.6, 4680.0], [62.7, 4697.0], [62.8, 4704.0], [62.9, 4718.0], [63.0, 4718.0], [63.1, 4720.0], [63.2, 4720.0], [63.3, 4762.0], [63.4, 4762.0], [63.5, 4765.0], [63.6, 4795.0], [63.7, 4811.0], [63.8, 4845.0], [63.9, 4845.0], [64.0, 4929.0], [64.1, 4939.0], [64.2, 4955.0], [64.3, 4974.0], [64.4, 4974.0], [64.5, 4982.0], [64.6, 4995.0], [64.7, 5011.0], [64.8, 5011.0], [64.9, 5021.0], [65.0, 5038.0], [65.1, 5086.0], [65.2, 5103.0], [65.3, 5103.0], [65.4, 5120.0], [65.5, 5137.0], [65.6, 5137.0], [65.7, 5137.0], [65.8, 5137.0], [65.9, 5149.0], [66.0, 5152.0], [66.1, 5155.0], [66.2, 5155.0], [66.3, 5169.0], [66.4, 5175.0], [66.5, 5179.0], [66.6, 5182.0], [66.7, 5182.0], [66.8, 5187.0], [66.9, 5190.0], [67.0, 5192.0], [67.1, 5261.0], [67.2, 5261.0], [67.3, 5261.0], [67.4, 5262.0], [67.5, 5267.0], [67.6, 5275.0], [67.7, 5275.0], [67.8, 5294.0], [67.9, 5297.0], [68.0, 5300.0], [68.1, 5300.0], [68.2, 5304.0], [68.3, 5315.0], [68.4, 5325.0], [68.5, 5342.0], [68.6, 5342.0], [68.7, 5356.0], [68.8, 5361.0], [68.9, 5361.0], [69.0, 5365.0], [69.1, 5365.0], [69.2, 5375.0], [69.3, 5382.0], [69.4, 5388.0], [69.5, 5388.0], [69.6, 5399.0], [69.7, 5435.0], [69.8, 5464.0], [69.9, 5500.0], [70.0, 5500.0], [70.1, 5510.0], [70.2, 5518.0], [70.3, 5521.0], [70.4, 5524.0], [70.5, 5524.0], [70.6, 5622.0], [70.7, 5630.0], [70.8, 5630.0], [70.9, 5630.0], [71.0, 5651.0], [71.1, 5667.0], [71.2, 5680.0], [71.3, 5681.0], [71.4, 5681.0], [71.5, 5681.0], [71.6, 5710.0], [71.7, 5725.0], [71.8, 5731.0], [71.9, 5731.0], [72.0, 5749.0], [72.1, 5751.0], [72.2, 5764.0], [72.3, 5771.0], [72.4, 5771.0], [72.5, 5772.0], [72.6, 5777.0], [72.7, 5781.0], [72.8, 5781.0], [72.9, 5797.0], [73.0, 5797.0], [73.1, 5799.0], [73.2, 5809.0], [73.3, 5809.0], [73.4, 5809.0], [73.5, 5825.0], [73.6, 5827.0], [73.7, 5832.0], [73.8, 5832.0], [73.9, 5848.0], [74.0, 5849.0], [74.1, 5857.0], [74.2, 5857.0], [74.3, 5861.0], [74.4, 5865.0], [74.5, 5872.0], [74.6, 5884.0], [74.7, 5884.0], [74.8, 5886.0], [74.9, 5898.0], [75.0, 5908.0], [75.1, 5914.0], [75.2, 5914.0], [75.3, 5915.0], [75.4, 5918.0], [75.5, 5921.0], [75.6, 5921.0], [75.7, 5923.0], [75.8, 5926.0], [75.9, 5966.0], [76.0, 5970.0], [76.1, 5970.0], [76.2, 5984.0], [76.3, 5986.0], [76.4, 5996.0], [76.5, 6005.0], [76.6, 6005.0], [76.7, 6011.0], [76.8, 6011.0], [76.9, 6015.0], [77.0, 6015.0], [77.1, 6031.0], [77.2, 6055.0], [77.3, 6055.0], [77.4, 6066.0], [77.5, 6066.0], [77.6, 6068.0], [77.7, 6069.0], [77.8, 6077.0], [77.9, 6079.0], [78.0, 6079.0], [78.1, 6093.0], [78.2, 6103.0], [78.3, 6109.0], [78.4, 6128.0], [78.5, 6128.0], [78.6, 6133.0], [78.7, 6163.0], [78.8, 6166.0], [78.9, 6166.0], [79.0, 6168.0], [79.1, 6170.0], [79.2, 6173.0], [79.3, 6178.0], [79.4, 6178.0], [79.5, 6197.0], [79.6, 6208.0], [79.7, 6213.0], [79.8, 6215.0], [79.9, 6215.0], [80.0, 6233.0], [80.1, 6236.0], [80.2, 6239.0], [80.3, 6239.0], [80.4, 6239.0], [80.5, 6239.0], [80.6, 6289.0], [80.7, 6319.0], [80.8, 6319.0], [80.9, 6320.0], [81.0, 6342.0], [81.1, 6354.0], [81.2, 6359.0], [81.3, 6359.0], [81.4, 6360.0], [81.5, 6371.0], [81.6, 6430.0], [81.7, 6430.0], [81.8, 6443.0], [81.9, 6444.0], [82.0, 6464.0], [82.1, 6466.0], [82.2, 6466.0], [82.3, 6530.0], [82.4, 6560.0], [82.5, 6587.0], [82.6, 6633.0], [82.7, 6633.0], [82.8, 6647.0], [82.9, 6659.0], [83.0, 6695.0], [83.1, 6695.0], [83.2, 6708.0], [83.3, 6733.0], [83.4, 6739.0], [83.5, 6757.0], [83.6, 6757.0], [83.7, 6763.0], [83.8, 6778.0], [83.9, 6801.0], [84.0, 6802.0], [84.1, 6802.0], [84.2, 6802.0], [84.3, 6819.0], [84.4, 6826.0], [84.5, 6851.0], [84.6, 6851.0], [84.7, 6880.0], [84.8, 6886.0], [84.9, 6902.0], [85.0, 6902.0], [85.1, 6920.0], [85.2, 6969.0], [85.3, 7012.0], [85.4, 7016.0], [85.5, 7016.0], [85.6, 7046.0], [85.7, 7079.0], [85.8, 7084.0], [85.9, 7094.0], [86.0, 7094.0], [86.1, 7115.0], [86.2, 7118.0], [86.3, 7128.0], [86.4, 7128.0], [86.5, 7129.0], [86.6, 7129.0], [86.7, 7155.0], [86.8, 7161.0], [86.9, 7161.0], [87.0, 7187.0], [87.1, 7190.0], [87.2, 7216.0], [87.3, 7227.0], [87.4, 7227.0], [87.5, 7276.0], [87.6, 7283.0], [87.7, 7283.0], [87.8, 7283.0], [87.9, 7364.0], [88.0, 7372.0], [88.1, 7409.0], [88.2, 7435.0], [88.3, 7435.0], [88.4, 7438.0], [88.5, 7468.0], [88.6, 7498.0], [88.7, 7506.0], [88.8, 7506.0], [88.9, 7515.0], [89.0, 7535.0], [89.1, 7562.0], [89.2, 7590.0], [89.3, 7590.0], [89.4, 7614.0], [89.5, 7656.0], [89.6, 7657.0], [89.7, 7657.0], [89.8, 7717.0], [89.9, 7785.0], [90.0, 7789.0], [90.1, 7799.0], [90.2, 7799.0], [90.3, 7813.0], [90.4, 7878.0], [90.5, 7891.0], [90.6, 7901.0], [90.7, 7901.0], [90.8, 8097.0], [90.9, 8117.0], [91.0, 8120.0], [91.1, 8120.0], [91.2, 8217.0], [91.3, 8288.0], [91.4, 8296.0], [91.5, 8310.0], [91.6, 8310.0], [91.7, 8335.0], [91.8, 8357.0], [91.9, 8474.0], [92.0, 8494.0], [92.1, 8494.0], [92.2, 8500.0], [92.3, 8558.0], [92.4, 8716.0], [92.5, 8716.0], [92.6, 8951.0], [92.7, 8993.0], [92.8, 8996.0], [92.9, 9178.0], [93.0, 9178.0], [93.1, 9188.0], [93.2, 9212.0], [93.3, 9237.0], [93.4, 9243.0], [93.5, 9243.0], [93.6, 9262.0], [93.7, 9333.0], [93.8, 9480.0], [93.9, 9480.0], [94.0, 9491.0], [94.1, 9700.0], [94.2, 9703.0], [94.3, 9730.0], [94.4, 9730.0], [94.5, 9731.0], [94.6, 9854.0], [94.7, 10036.0], [94.8, 10075.0], [94.9, 10075.0], [95.0, 10114.0], [95.1, 10117.0], [95.2, 10178.0], [95.3, 10198.0], [95.4, 10198.0], [95.5, 10206.0], [95.6, 10244.0], [95.7, 10247.0], [95.8, 10247.0], [95.9, 10262.0], [96.0, 10310.0], [96.1, 10637.0], [96.2, 10650.0], [96.3, 10650.0], [96.4, 10672.0], [96.5, 10722.0], [96.6, 10755.0], [96.7, 10884.0], [96.8, 10884.0], [96.9, 10887.0], [97.0, 10918.0], [97.1, 10958.0], [97.2, 10958.0], [97.3, 11083.0], [97.4, 11115.0], [97.5, 11160.0], [97.6, 11186.0], [97.7, 11186.0], [97.8, 11247.0], [97.9, 11298.0], [98.0, 11386.0], [98.1, 11416.0], [98.2, 11416.0], [98.3, 11579.0], [98.4, 11611.0], [98.5, 11698.0], [98.6, 11698.0], [98.7, 11781.0], [98.8, 11839.0], [98.9, 12102.0], [99.0, 12300.0], [99.1, 12300.0], [99.2, 12361.0], [99.3, 12512.0], [99.4, 12598.0], [99.5, 12950.0], [99.6, 12950.0], [99.7, 13069.0], [99.8, 13578.0], [99.9, 14996.0]], "isOverall": false, "label": "HTTP Request", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
        getOptions: function() {
            return {
                series: {
                    points: { show: false }
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentiles'
                },
                xaxis: {
                    tickDecimals: 1,
                    axisLabel: "Percentiles",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Percentile value in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : %x.2 percentile was %y ms"
                },
                selection: { mode: "xy" },
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentiles"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesPercentiles"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesPercentiles"), dataset, prepareOverviewOptions(options));
        }
};

/**
 * @param elementId Id of element where we display message
 */
function setEmptyGraph(elementId) {
    $(function() {
        $(elementId).text("No graph series with filter="+seriesFilter);
    });
}

// Response times percentiles
function refreshResponseTimePercentiles() {
    var infos = responseTimePercentilesInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimePercentiles");
        return;
    }
    if (isGraph($("#flotResponseTimesPercentiles"))){
        infos.createGraph();
    } else {
        var choiceContainer = $("#choicesResponseTimePercentiles");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesPercentiles", "#overviewResponseTimesPercentiles");
        $('#bodyResponseTimePercentiles .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimeDistributionInfos = {
        data: {"result": {"minY": 1.0, "minX": 1700.0, "maxY": 261.0, "series": [{"data": [[1700.0, 261.0], [1800.0, 34.0], [1900.0, 3.0], [2000.0, 4.0], [2100.0, 4.0], [2200.0, 6.0], [2300.0, 9.0], [2400.0, 15.0], [2500.0, 12.0], [2600.0, 9.0], [2700.0, 10.0], [2800.0, 5.0], [2900.0, 3.0], [3000.0, 10.0], [3100.0, 6.0], [3200.0, 13.0], [3300.0, 2.0], [3400.0, 5.0], [3500.0, 9.0], [3600.0, 4.0], [3700.0, 3.0], [3800.0, 8.0], [3900.0, 3.0], [4000.0, 9.0], [4100.0, 11.0], [4200.0, 3.0], [4300.0, 9.0], [4400.0, 11.0], [4500.0, 5.0], [4600.0, 8.0], [4700.0, 7.0], [4800.0, 2.0], [5100.0, 15.0], [5000.0, 4.0], [4900.0, 6.0], [5300.0, 13.0], [5200.0, 7.0], [5600.0, 8.0], [5500.0, 5.0], [5400.0, 2.0], [5700.0, 13.0], [5800.0, 14.0], [6100.0, 11.0], [5900.0, 12.0], [6000.0, 13.0], [6200.0, 9.0], [6300.0, 7.0], [6400.0, 5.0], [6600.0, 4.0], [6500.0, 3.0], [6900.0, 3.0], [6700.0, 6.0], [6800.0, 8.0], [7000.0, 6.0], [7100.0, 9.0], [7400.0, 5.0], [7300.0, 2.0], [7200.0, 5.0], [7600.0, 3.0], [7500.0, 5.0], [7700.0, 4.0], [7800.0, 3.0], [7900.0, 1.0], [8100.0, 2.0], [8000.0, 1.0], [8300.0, 3.0], [8200.0, 3.0], [8400.0, 2.0], [8500.0, 2.0], [8700.0, 1.0], [9200.0, 4.0], [9100.0, 2.0], [8900.0, 3.0], [9700.0, 4.0], [9400.0, 2.0], [9300.0, 1.0], [9800.0, 1.0], [10000.0, 2.0], [10100.0, 4.0], [10200.0, 4.0], [10300.0, 1.0], [10600.0, 3.0], [10700.0, 2.0], [10800.0, 2.0], [11000.0, 1.0], [10900.0, 2.0], [11200.0, 2.0], [11100.0, 3.0], [11500.0, 1.0], [11300.0, 1.0], [11600.0, 2.0], [11700.0, 1.0], [11400.0, 1.0], [11800.0, 1.0], [12100.0, 1.0], [12300.0, 2.0], [12500.0, 2.0], [12900.0, 1.0], [13000.0, 1.0], [13500.0, 1.0], [14900.0, 1.0]], "isOverall": false, "label": "HTTP Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 14900.0, "title": "Response Time Distribution"}},
        getOptions: function() {
            var granularity = this.data.result.granularity;
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    barWidth: this.data.result.granularity
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " responses for " + label + " were between " + xval + " and " + (xval + granularity) + " ms";
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimeDistribution"), prepareData(data.result.series, $("#choicesResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshResponseTimeDistribution() {
    var infos = responseTimeDistributionInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeDistribution");
        return;
    }
    if (isGraph($("#flotResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var syntheticResponseTimeDistributionInfos = {
        data: {"result": {"minY": 22.0, "minX": 2.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 765.0, "series": [{"data": [], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [[2.0, 765.0]], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [[3.0, 22.0]], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 3.0, "title": "Synthetic Response Times Distribution"}},
        getOptions: function() {
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendSyntheticResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times ranges",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                    tickLength:0,
                    min:-0.5,
                    max:3.5
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    align: "center",
                    barWidth: 0.25,
                    fill:.75
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " " + label;
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            options.xaxis.ticks = data.result.ticks;
            $.plot($("#flotSyntheticResponseTimeDistribution"), prepareData(data.result.series, $("#choicesSyntheticResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshSyntheticResponseTimeDistribution() {
    var infos = syntheticResponseTimeDistributionInfos;
    prepareSeries(infos.data, true);
    if (isGraph($("#flotSyntheticResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerSyntheticResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var activeThreadsOverTimeInfos = {
        data: {"result": {"minY": 6.28409090909091, "minX": 1.69996728E12, "maxY": 56.4111842105263, "series": [{"data": [[1.6999674E12, 11.63736263736264], [1.69996734E12, 56.4111842105263], [1.69996728E12, 6.28409090909091]], "isOverall": false, "label": "Open Model Thread Group", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.6999674E12, "title": "Active Threads Over Time"}},
        getOptions: function() {
            return {
                series: {
                    stack: true,
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 6,
                    show: true,
                    container: '#legendActiveThreadsOverTime'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                selection: {
                    mode: 'xy'
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : At %x there were %y active threads"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesActiveThreadsOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotActiveThreadsOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewActiveThreadsOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Active Threads Over Time
function refreshActiveThreadsOverTime(fixTimestamps) {
    var infos = activeThreadsOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotActiveThreadsOverTime"))) {
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesActiveThreadsOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotActiveThreadsOverTime", "#overviewActiveThreadsOverTime");
        $('#footerActiveThreadsOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var timeVsThreadsInfos = {
        data: {"result": {"minY": 1785.9, "minX": 1.0, "maxY": 11139.5, "series": [{"data": [[2.0, 1793.4000000000003], [3.0, 1793.608695652174], [4.0, 1822.3478260869565], [5.0, 1875.0000000000002], [6.0, 1787.5], [7.0, 1919.1666666666665], [8.0, 1887.8000000000002], [9.0, 1928.0833333333333], [10.0, 2272.5333333333333], [11.0, 1791.076923076923], [12.0, 2024.4545454545455], [13.0, 2263.083333333333], [14.0, 2281.0], [15.0, 1964.9333333333334], [16.0, 2113.933333333333], [17.0, 1956.5], [18.0, 1785.9], [19.0, 2203.2857142857147], [20.0, 1819.857142857143], [21.0, 3032.8], [22.0, 2211.0], [23.0, 3073.8333333333335], [24.0, 3190.0], [25.0, 3246.333333333333], [26.0, 3182.333333333333], [27.0, 3310.5], [28.0, 2292.5], [29.0, 2351.2000000000003], [30.0, 4458.6], [31.0, 4103.875], [32.0, 2297.5], [33.0, 3213.875], [35.0, 3309.0], [34.0, 3003.142857142857], [36.0, 3115.0], [37.0, 3458.4], [39.0, 3159.9999999999995], [38.0, 3499.3333333333335], [40.0, 3555.833333333333], [41.0, 4154.125], [43.0, 7789.0], [42.0, 7118.0], [45.0, 5230.0], [44.0, 4519.0], [46.0, 4039.0], [47.0, 5386.0], [48.0, 5447.714285714286], [49.0, 3463.0], [50.0, 4412.666666666666], [51.0, 4174.5], [52.0, 3360.75], [53.0, 4443.285714285714], [54.0, 5619.666666666667], [55.0, 11139.5], [57.0, 6184.6], [56.0, 5957.25], [58.0, 5707.571428571428], [59.0, 7185.666666666667], [61.0, 7202.5], [60.0, 9562.0], [63.0, 10052.0], [62.0, 9986.0], [67.0, 7748.2], [66.0, 5425.4], [65.0, 9367.333333333334], [71.0, 6700.666666666666], [70.0, 4635.714285714286], [69.0, 6031.333333333333], [68.0, 9730.5], [74.0, 5503.6], [72.0, 5801.0], [75.0, 5569.571428571429], [73.0, 10650.0], [76.0, 5513.5], [79.0, 5068.999999999999], [77.0, 8014.0], [78.0, 5585.0], [80.0, 4744.666666666667], [81.0, 4465.166666666666], [83.0, 6239.200000000001], [82.0, 6096.500000000001], [84.0, 6334.625000000001], [85.0, 6424.35], [87.0, 5664.8], [86.0, 6693.222222222222], [88.0, 7247.666666666667], [89.0, 6848.666666666666], [90.0, 8964.0], [93.0, 6802.4], [95.0, 7248.2], [94.0, 5572.666666666667], [92.0, 6597.0], [99.0, 7249.6], [97.0, 5846.874999999999], [96.0, 5179.5], [98.0, 7137.6], [102.0, 7512.454545454546], [100.0, 6798.736842105262], [101.0, 8021.444444444444], [103.0, 6592.0], [105.0, 9237.0], [104.0, 6397.0], [1.0, 1799.1538461538464]], "isOverall": false, "label": "HTTP Request", "isController": false}, {"data": [[45.62897077509528, 4174.114358322743]], "isOverall": false, "label": "HTTP Request-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 105.0, "title": "Time VS Threads"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: { noColumns: 2,show: true, container: '#legendTimeVsThreads' },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s: At %x.2 active threads, Average response time was %y.2 ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesTimeVsThreads"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotTimesVsThreads"), dataset, options);
            // setup overview
            $.plot($("#overviewTimesVsThreads"), dataset, prepareOverviewOptions(options));
        }
};

// Time vs threads
function refreshTimeVsThreads(){
    var infos = timeVsThreadsInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTimeVsThreads");
        return;
    }
    if(isGraph($("#flotTimesVsThreads"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTimeVsThreads");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTimesVsThreads", "#overviewTimesVsThreads");
        $('#footerTimeVsThreads .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var bytesThroughputOverTimeInfos = {
        data : {"result": {"minY": 222.93333333333334, "minX": 1.69996728E12, "maxY": 214594.93333333332, "series": [{"data": [[1.6999674E12, 354.9], [1.69996734E12, 214594.93333333332], [1.69996728E12, 343.2]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.6999674E12, 230.53333333333333], [1.69996734E12, 1540.2666666666667], [1.69996728E12, 222.93333333333334]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.6999674E12, "title": "Bytes Throughput Over Time"}},
        getOptions : function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity) ,
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Bytes / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendBytesThroughputOverTime'
                },
                selection: {
                    mode: "xy"
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y"
                }
            };
        },
        createGraph : function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesBytesThroughputOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotBytesThroughputOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewBytesThroughputOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Bytes throughput Over Time
function refreshBytesThroughputOverTime(fixTimestamps) {
    var infos = bytesThroughputOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotBytesThroughputOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesBytesThroughputOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotBytesThroughputOverTime", "#overviewBytesThroughputOverTime");
        $('#footerBytesThroughputOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimesOverTimeInfos = {
        data: {"result": {"minY": 1789.261363636363, "minX": 1.69996728E12, "maxY": 4645.741776315788, "series": [{"data": [[1.6999674E12, 3329.252747252747], [1.69996734E12, 4645.741776315788], [1.69996728E12, 1789.261363636363]], "isOverall": false, "label": "HTTP Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.6999674E12, "title": "Response Time Over Time"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average response time was %y ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Times Over Time
function refreshResponseTimeOverTime(fixTimestamps) {
    var infos = responseTimesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotResponseTimesOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesOverTime", "#overviewResponseTimesOverTime");
        $('#footerResponseTimesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var latenciesOverTimeInfos = {
        data: {"result": {"minY": 1787.0227272727277, "minX": 1.69996728E12, "maxY": 4643.379934210525, "series": [{"data": [[1.6999674E12, 3325.8131868131854], [1.69996734E12, 4643.379934210525], [1.69996728E12, 1787.0227272727277]], "isOverall": false, "label": "HTTP Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.6999674E12, "title": "Latencies Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response latencies in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendLatenciesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average latency was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesLatenciesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotLatenciesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewLatenciesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Latencies Over Time
function refreshLatenciesOverTime(fixTimestamps) {
    var infos = latenciesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyLatenciesOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotLatenciesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesLatenciesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotLatenciesOverTime", "#overviewLatenciesOverTime");
        $('#footerLatenciesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var connectTimeOverTimeInfos = {
        data: {"result": {"minY": 0.9851973684210534, "minX": 1.69996728E12, "maxY": 1.4431818181818186, "series": [{"data": [[1.6999674E12, 1.2637362637362637], [1.69996734E12, 0.9851973684210534], [1.69996728E12, 1.4431818181818186]], "isOverall": false, "label": "HTTP Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.6999674E12, "title": "Connect Time Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getConnectTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average Connect Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendConnectTimeOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average connect time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesConnectTimeOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotConnectTimeOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewConnectTimeOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Connect Time Over Time
function refreshConnectTimeOverTime(fixTimestamps) {
    var infos = connectTimeOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyConnectTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotConnectTimeOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesConnectTimeOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotConnectTimeOverTime", "#overviewConnectTimeOverTime");
        $('#footerConnectTimeOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var responseTimePercentilesOverTimeInfos = {
        data: {"result": {"minY": 1774.0, "minX": 1.69996728E12, "maxY": 14996.0, "series": [{"data": [[1.6999674E12, 8996.0], [1.69996734E12, 14996.0], [1.69996728E12, 1835.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.6999674E12, 1783.0], [1.69996734E12, 1774.0], [1.69996728E12, 1776.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.6999674E12, 5831.0], [1.69996734E12, 7832.500000000005], [1.69996728E12, 1800.0]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.6999674E12, 8996.0], [1.69996734E12, 12380.63], [1.69996728E12, 1835.0]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.6999674E12, 1803.0], [1.69996734E12, 3987.0], [1.69996728E12, 1787.0]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.6999674E12, 6794.4], [1.69996734E12, 10293.199999999999], [1.69996728E12, 1802.55]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.6999674E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Response Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentilesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Response time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentilesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimePercentilesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimePercentilesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Time Percentiles Over Time
function refreshResponseTimePercentilesOverTime(fixTimestamps) {
    var infos = responseTimePercentilesOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotResponseTimePercentilesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimePercentilesOverTime", "#overviewResponseTimePercentilesOverTime");
        $('#footerResponseTimePercentilesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var responseTimeVsRequestInfos = {
    data: {"result": {"minY": 1778.0, "minX": 1.0, "maxY": 12346.5, "series": [{"data": [[2.0, 1795.5], [8.0, 1783.0], [9.0, 2782.0], [10.0, 4059.5], [11.0, 5681.0], [3.0, 1796.0], [12.0, 3520.5], [13.0, 4811.0], [14.0, 5577.0], [15.0, 4488.0], [1.0, 1797.0], [4.0, 1784.0], [16.0, 5721.5], [17.0, 1778.0], [18.0, 6371.0], [5.0, 1790.0], [22.0, 5622.0], [6.0, 1793.5], [7.0, 3342.0]], "isOverall": false, "label": "Successes", "isController": false}, {"data": [[16.0, 12346.5], [18.0, 9243.0], [9.0, 10637.0], [22.0, 8494.0]], "isOverall": false, "label": "Failures", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 22.0, "title": "Response Time Vs Request"}},
    getOptions: function() {
        return {
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Response Time in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: {
                noColumns: 2,
                show: true,
                container: '#legendResponseTimeVsRequest'
            },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median response time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesResponseTimeVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotResponseTimeVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewResponseTimeVsRequest"), dataset, prepareOverviewOptions(options));

    }
};

// Response Time vs Request
function refreshResponseTimeVsRequest() {
    var infos = responseTimeVsRequestInfos;
    prepareSeries(infos.data);
    if (isGraph($("#flotResponseTimeVsRequest"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeVsRequest");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimeVsRequest", "#overviewResponseTimeVsRequest");
        $('#footerResponseRimeVsRequest .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var latenciesVsRequestInfos = {
    data: {"result": {"minY": 1777.0, "minX": 1.0, "maxY": 12345.5, "series": [{"data": [[2.0, 1793.0], [8.0, 1781.0], [9.0, 2780.5], [10.0, 4057.5], [11.0, 5679.0], [3.0, 1793.0], [12.0, 3519.0], [13.0, 4807.0], [14.0, 5575.0], [15.0, 4484.5], [1.0, 1794.0], [4.0, 1782.0], [16.0, 5718.5], [17.0, 1777.0], [18.0, 6368.0], [5.0, 1787.5], [22.0, 5620.0], [6.0, 1790.5], [7.0, 3339.0]], "isOverall": false, "label": "Successes", "isController": false}, {"data": [[16.0, 12345.5], [18.0, 9241.0], [9.0, 10633.5], [22.0, 8491.0]], "isOverall": false, "label": "Failures", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 22.0, "title": "Latencies Vs Request"}},
    getOptions: function() {
        return{
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Latency in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: { noColumns: 2,show: true, container: '#legendLatencyVsRequest' },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median Latency time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesLatencyVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotLatenciesVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewLatenciesVsRequest"), dataset, prepareOverviewOptions(options));
    }
};

// Latencies vs Request
function refreshLatenciesVsRequest() {
        var infos = latenciesVsRequestInfos;
        prepareSeries(infos.data);
        if(isGraph($("#flotLatenciesVsRequest"))){
            infos.createGraph();
        }else{
            var choiceContainer = $("#choicesLatencyVsRequest");
            createLegend(choiceContainer, infos);
            infos.createGraph();
            setGraphZoomable("#flotLatenciesVsRequest", "#overviewLatenciesVsRequest");
            $('#footerLatenciesVsRequest .legendColorBox > div').each(function(i){
                $(this).clone().prependTo(choiceContainer.find("li").eq(i));
            });
        }
};

var hitsPerSecondInfos = {
        data: {"result": {"minY": 0.9, "minX": 1.69996728E12, "maxY": 10.633333333333333, "series": [{"data": [[1.6999674E12, 0.9], [1.69996734E12, 10.633333333333333], [1.69996728E12, 1.5833333333333333]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.6999674E12, "title": "Hits Per Second"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of hits / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendHitsPerSecond"
                },
                selection: {
                    mode : 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y.2 hits/sec"
                }
            };
        },
        createGraph: function createGraph() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesHitsPerSecond"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotHitsPerSecond"), dataset, options);
            // setup overview
            $.plot($("#overviewHitsPerSecond"), dataset, prepareOverviewOptions(options));
        }
};

// Hits per second
function refreshHitsPerSecond(fixTimestamps) {
    var infos = hitsPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if (isGraph($("#flotHitsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesHitsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotHitsPerSecond", "#overviewHitsPerSecond");
        $('#footerHitsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var codesPerSecondInfos = {
        data: {"result": {"minY": 0.36666666666666664, "minX": 1.69996728E12, "maxY": 9.766666666666667, "series": [{"data": [[1.6999674E12, 1.5166666666666666], [1.69996734E12, 9.766666666666667], [1.69996728E12, 1.4666666666666666]], "isOverall": false, "label": "200", "isController": false}, {"data": [[1.69996734E12, 0.36666666666666664]], "isOverall": false, "label": "503", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.6999674E12, "title": "Codes Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendCodesPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "Number of Response Codes %s at %x was %y.2 responses / sec"
                }
            };
        },
    createGraph: function() {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesCodesPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotCodesPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewCodesPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Codes per second
function refreshCodesPerSecond(fixTimestamps) {
    var infos = codesPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotCodesPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesCodesPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotCodesPerSecond", "#overviewCodesPerSecond");
        $('#footerCodesPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var transactionsPerSecondInfos = {
        data: {"result": {"minY": 0.36666666666666664, "minX": 1.69996728E12, "maxY": 9.766666666666667, "series": [{"data": [[1.6999674E12, 1.5166666666666666], [1.69996734E12, 9.766666666666667], [1.69996728E12, 1.4666666666666666]], "isOverall": false, "label": "HTTP Request-success", "isController": false}, {"data": [[1.69996734E12, 0.36666666666666664]], "isOverall": false, "label": "HTTP Request-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.6999674E12, "title": "Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTransactionsPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                }
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTransactionsPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTransactionsPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewTransactionsPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Transactions per second
function refreshTransactionsPerSecond(fixTimestamps) {
    var infos = transactionsPerSecondInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTransactionsPerSecond");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotTransactionsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTransactionsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTransactionsPerSecond", "#overviewTransactionsPerSecond");
        $('#footerTransactionsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var totalTPSInfos = {
        data: {"result": {"minY": 0.36666666666666664, "minX": 1.69996728E12, "maxY": 9.766666666666667, "series": [{"data": [[1.6999674E12, 1.5166666666666666], [1.69996734E12, 9.766666666666667], [1.69996728E12, 1.4666666666666666]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [[1.69996734E12, 0.36666666666666664]], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.6999674E12, "title": "Total Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTotalTPS"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                },
                colors: ["#9ACD32", "#FF6347"]
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTotalTPS"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTotalTPS"), dataset, options);
        // setup overview
        $.plot($("#overviewTotalTPS"), dataset, prepareOverviewOptions(options));
    }
};

// Total Transactions per second
function refreshTotalTPS(fixTimestamps) {
    var infos = totalTPSInfos;
    // We want to ignore seriesFilter
    prepareSeries(infos.data, false, true);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -18000000);
    }
    if(isGraph($("#flotTotalTPS"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTotalTPS");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTotalTPS", "#overviewTotalTPS");
        $('#footerTotalTPS .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

// Collapse the graph matching the specified DOM element depending the collapsed
// status
function collapse(elem, collapsed){
    if(collapsed){
        $(elem).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    } else {
        $(elem).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
        if (elem.id == "bodyBytesThroughputOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshBytesThroughputOverTime(true);
            }
            document.location.href="#bytesThroughputOverTime";
        } else if (elem.id == "bodyLatenciesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesOverTime(true);
            }
            document.location.href="#latenciesOverTime";
        } else if (elem.id == "bodyCustomGraph") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCustomGraph(true);
            }
            document.location.href="#responseCustomGraph";
        } else if (elem.id == "bodyConnectTimeOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshConnectTimeOverTime(true);
            }
            document.location.href="#connectTimeOverTime";
        } else if (elem.id == "bodyResponseTimePercentilesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimePercentilesOverTime(true);
            }
            document.location.href="#responseTimePercentilesOverTime";
        } else if (elem.id == "bodyResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeDistribution();
            }
            document.location.href="#responseTimeDistribution" ;
        } else if (elem.id == "bodySyntheticResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshSyntheticResponseTimeDistribution();
            }
            document.location.href="#syntheticResponseTimeDistribution" ;
        } else if (elem.id == "bodyActiveThreadsOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshActiveThreadsOverTime(true);
            }
            document.location.href="#activeThreadsOverTime";
        } else if (elem.id == "bodyTimeVsThreads") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTimeVsThreads();
            }
            document.location.href="#timeVsThreads" ;
        } else if (elem.id == "bodyCodesPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCodesPerSecond(true);
            }
            document.location.href="#codesPerSecond";
        } else if (elem.id == "bodyTransactionsPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTransactionsPerSecond(true);
            }
            document.location.href="#transactionsPerSecond";
        } else if (elem.id == "bodyTotalTPS") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTotalTPS(true);
            }
            document.location.href="#totalTPS";
        } else if (elem.id == "bodyResponseTimeVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeVsRequest();
            }
            document.location.href="#responseTimeVsRequest";
        } else if (elem.id == "bodyLatenciesVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesVsRequest();
            }
            document.location.href="#latencyVsRequest";
        }
    }
}

/*
 * Activates or deactivates all series of the specified graph (represented by id parameter)
 * depending on checked argument.
 */
function toggleAll(id, checked){
    var placeholder = document.getElementById(id);

    var cases = $(placeholder).find(':checkbox');
    cases.prop('checked', checked);
    $(cases).parent().children().children().toggleClass("legend-disabled", !checked);

    var choiceContainer;
    if ( id == "choicesBytesThroughputOverTime"){
        choiceContainer = $("#choicesBytesThroughputOverTime");
        refreshBytesThroughputOverTime(false);
    } else if(id == "choicesResponseTimesOverTime"){
        choiceContainer = $("#choicesResponseTimesOverTime");
        refreshResponseTimeOverTime(false);
    }else if(id == "choicesResponseCustomGraph"){
        choiceContainer = $("#choicesResponseCustomGraph");
        refreshCustomGraph(false);
    } else if ( id == "choicesLatenciesOverTime"){
        choiceContainer = $("#choicesLatenciesOverTime");
        refreshLatenciesOverTime(false);
    } else if ( id == "choicesConnectTimeOverTime"){
        choiceContainer = $("#choicesConnectTimeOverTime");
        refreshConnectTimeOverTime(false);
    } else if ( id == "choicesResponseTimePercentilesOverTime"){
        choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        refreshResponseTimePercentilesOverTime(false);
    } else if ( id == "choicesResponseTimePercentiles"){
        choiceContainer = $("#choicesResponseTimePercentiles");
        refreshResponseTimePercentiles();
    } else if(id == "choicesActiveThreadsOverTime"){
        choiceContainer = $("#choicesActiveThreadsOverTime");
        refreshActiveThreadsOverTime(false);
    } else if ( id == "choicesTimeVsThreads"){
        choiceContainer = $("#choicesTimeVsThreads");
        refreshTimeVsThreads();
    } else if ( id == "choicesSyntheticResponseTimeDistribution"){
        choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        refreshSyntheticResponseTimeDistribution();
    } else if ( id == "choicesResponseTimeDistribution"){
        choiceContainer = $("#choicesResponseTimeDistribution");
        refreshResponseTimeDistribution();
    } else if ( id == "choicesHitsPerSecond"){
        choiceContainer = $("#choicesHitsPerSecond");
        refreshHitsPerSecond(false);
    } else if(id == "choicesCodesPerSecond"){
        choiceContainer = $("#choicesCodesPerSecond");
        refreshCodesPerSecond(false);
    } else if ( id == "choicesTransactionsPerSecond"){
        choiceContainer = $("#choicesTransactionsPerSecond");
        refreshTransactionsPerSecond(false);
    } else if ( id == "choicesTotalTPS"){
        choiceContainer = $("#choicesTotalTPS");
        refreshTotalTPS(false);
    } else if ( id == "choicesResponseTimeVsRequest"){
        choiceContainer = $("#choicesResponseTimeVsRequest");
        refreshResponseTimeVsRequest();
    } else if ( id == "choicesLatencyVsRequest"){
        choiceContainer = $("#choicesLatencyVsRequest");
        refreshLatenciesVsRequest();
    }
    var color = checked ? "black" : "#818181";
    if(choiceContainer != null) {
        choiceContainer.find("label").each(function(){
            this.style.color = color;
        });
    }
}

