package be.pxl.services.repository;

import be.pxl.services.controller.dto.PostDto;
import be.pxl.services.domain.Post;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    @Query(value = "SELECT * FROM post WHERE approved_status = true", nativeQuery = true)
    List<Post> findApprovedPostsNative();

    @Query(value = "SELECT * FROM post WHERE approved_status = false", nativeQuery = true)
    List<Post> findRejectedPostsNative();

    @Query(value = "SELECT * FROM post WHERE draft = true OR approved_status = false", nativeQuery = true)
    List<Post> findDraftPosts();
}
