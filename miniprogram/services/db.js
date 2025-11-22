/**
 * 数据库服务层 - 统一封装云数据库操作
 * 单例模式，确保全局唯一实例
 */

class DBService {
  constructor() {
    if (DBService.instance) {
      return DBService.instance;
    }
    
    this.db = wx.cloud.database();
    this._ = this.db.command;
    
    // 集合引用
    this.heroesCollection = this.db.collection('heroes');
    this.eventsCollection = this.db.collection('events');
    this.quotesCollection = this.db.collection('quotes');
    
    DBService.instance = this;
  }

  /**
   * 获取英雄列表
   * @param {string} category - 时期分类 ('all' | 'revolution' | 'construction' | 'reform' | 'newera')
   * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
   */
  async getHeroList(category = 'all') {
    try {
      let query = this.heroesCollection.orderBy('sort_order', 'asc');
      
      // 如果指定分类，添加筛选条件
      if (category !== 'all') {
        query = query.where({
          era: category
        });
      }
      
      const res = await query.get();
      
      return {
        success: true,
        data: res.data || []
      };
    } catch (error) {
      console.error('[DBService] getHeroList 失败:', error);
      return {
        success: false,
        error: error.errMsg || '获取英雄列表失败',
        data: []
      };
    }
  }

  /**
   * 获取英雄详情
   * @param {string} id - 英雄ID
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async getHeroDetail(id) {
    try {
      if (!id) {
        throw new Error('英雄ID不能为空');
      }

      const res = await this.heroesCollection.doc(id).get();
      
      if (!res.data) {
        throw new Error('未找到该英雄');
      }

      return {
        success: true,
        data: res.data
      };
    } catch (error) {
      console.error('[DBService] getHeroDetail 失败:', error);
      return {
        success: false,
        error: error.errMsg || error.message || '获取英雄详情失败',
        data: null
      };
    }
  }

  /**
   * 获取每日名言（随机）
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async getDailyQuote() {
    try {
      // 获取总数
      const countRes = await this.quotesCollection.count();
      const total = countRes.total;

      if (total === 0) {
        // 数据库为空，返回硬编码兜底名言
        return {
          success: true,
          data: this._getFallbackQuote(),
          fromFallback: true
        };
      }

      // 随机跳过 N 条，取 1 条
      const randomSkip = Math.floor(Math.random() * total);
      const res = await this.quotesCollection
        .skip(randomSkip)
        .limit(1)
        .get();

      if (res.data && res.data.length > 0) {
        return {
          success: true,
          data: res.data[0]
        };
      } else {
        return {
          success: true,
          data: this._getFallbackQuote(),
          fromFallback: true
        };
      }
    } catch (error) {
      console.error('[DBService] getDailyQuote 失败:', error);
      // 出错时返回兜底名言
      return {
        success: true,
        data: this._getFallbackQuote(),
        fromFallback: true,
        error: error.errMsg || '获取名言失败，使用默认名言'
      };
    }
  }

  /**
   * 获取历史事件列表
   * @param {string} category - 时期分类 ('all' | 'revolution' | 'construction' | 'reform')
   * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
   */
  async getEventList(category = 'all') {
    try {
      let query = this.eventsCollection.orderBy('year', 'asc');
      
      if (category !== 'all') {
        query = query.where({
          category: category
        });
      }
      
      const res = await query.get();
      
      return {
        success: true,
        data: res.data || []
      };
    } catch (error) {
      console.error('[DBService] getEventList 失败:', error);
      return {
        success: false,
        error: error.errMsg || '获取事件列表失败',
        data: []
      };
    }
  }

  /**
   * 获取今日推荐英雄（基于日期算法）
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async getTodayHero() {
    try {
      const allHeroes = await this.getHeroList('all');
      
      if (!allHeroes.success || allHeroes.data.length === 0) {
        return {
          success: false,
          error: '暂无英雄数据',
          data: null
        };
      }

      // 基于日期的伪随机算法（同一天返回相同英雄）
      const today = new Date();
      const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
      const index = dayOfYear % allHeroes.data.length;

      return {
        success: true,
        data: allHeroes.data[index]
      };
    } catch (error) {
      console.error('[DBService] getTodayHero 失败:', error);
      return {
        success: false,
        error: error.errMsg || '获取今日英雄失败',
        data: null
      };
    }
  }

  /**
   * 兜底名言（硬编码）
   * @private
   */
  _getFallbackQuote() {
    const fallbackQuotes = [
      { content: '星星之火，可以燎原', author: '毛泽东' },
      { content: '为人民服务', author: '毛泽东' },
      { content: '雄关漫道真如铁，而今迈步从头越', author: '毛泽东' },
      { content: '人的生命是有限的，可是为人民服务是无限的', author: '雷锋' },
      { content: '生的伟大，死的光荣', author: '毛泽东（题刘胡兰）' }
    ];

    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    return fallbackQuotes[randomIndex];
  }
}

// 导出单例
module.exports = new DBService();
