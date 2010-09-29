class RemoveAttrScore < ActiveRecord::Migration
  def self.up
    remove_column :user_scores, :knowledge_score
    remove_column :user_scores, :tech_score
    
  end

  def self.down
    add_column :user_scores, :knowledge_score , :integer
    add_column :user_scores, :tech_score , :integer

  end
end
