class TacticsController < ApplicationController
  before_filter :redirect_to_highest_level

  def index
    offset = params[:offset].to_i
    @next_offset = offset + Puzzles::SET_SIZE
    @tactics_set_id = (offset / Puzzles::SET_SIZE) + 1
  end

  private

  def redirect_to_highest_level
    return unless current_user
    level = Level.find(current_user.highest_level_unlocked)
    redirect_to "/#{level.slug}"
  end

end
